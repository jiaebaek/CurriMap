CREATE OR REPLACE FUNCTION public.check_level_up_eligibility(p_child_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_level_id bigint;
    v_threshold RECORD;
    v_stats RECORD;
    
    v_book_progress real := 0;
    v_listening_progress real := 0;
    v_video_progress real := 0;
    v_activity_progress real := 0;
    
    v_other_items_progress_avg real := 0;
    v_can_level_up boolean := false;
BEGIN
    -- 1. 자녀의 현재 레벨 확인
    SELECT current_level_id INTO v_current_level_id FROM public.children WHERE id = p_child_id;

    IF v_current_level_id IS NULL THEN
        -- 레벨 정보가 없으면 레벨업 불가
        RETURN false;
    END IF;

    -- 2. 현재 레벨의 레벨업 기준(threshold) 조회
    SELECT * INTO v_threshold
    FROM public.level_up_thresholds
    WHERE level_id = v_current_level_id;

    IF v_threshold IS NULL THEN
        -- 현재 레벨에 대한 레벨업 기준이 정의되지 않았으면 레벨업 불가
        RETURN false;
    END IF;

    -- 3. 자녀의 현재 누적 활동량 집계
    SELECT
        c.total_books_read,
        -- 분 단위를 시간 단위로 변환하여 집계
        COALESCE((SELECT SUM(duration_minutes) FROM public.mission_logs WHERE child_id = p_child_id AND activity_type = 'listening'), 0) / 60.0 AS total_listening_hours,
        COALESCE((SELECT SUM(duration_minutes) FROM public.mission_logs WHERE child_id = p_child_id AND activity_type = 'video'), 0) / 60.0 AS total_video_hours,
        (SELECT COUNT(*) FROM public.mission_logs WHERE child_id = p_child_id AND activity_type = 'activity') AS total_activity_count
    INTO v_stats
    FROM public.children c
    WHERE c.id = p_child_id;

    -- 4. 각 항목별 진행률(%) 계산 (0으로 나누기 오류 방지)
    IF v_threshold.book_count_threshold > 0 THEN
        v_book_progress := v_stats.total_books_read / v_threshold.book_count_threshold::real;
    END IF;

    IF v_threshold.listening_hours_threshold > 0 THEN
        v_listening_progress := v_stats.total_listening_hours / v_threshold.listening_hours_threshold::real;
    END IF;

    IF v_threshold.video_hours_threshold > 0 THEN
        v_video_progress := v_stats.total_video_hours / v_threshold.video_hours_threshold::real;
    END IF;

    IF v_threshold.activity_count_threshold > 0 THEN
        v_activity_progress := v_stats.total_activity_count / v_threshold.activity_count_threshold::real;
    END IF;

    -- 5. 레벨업기준표의 핵심 로직 적용
    -- Logic: IF (책읽기 >= 100%) AND (나머지 3개 항목 평균 >= 80%)
    
    v_other_items_progress_avg := (v_listening_progress + v_video_progress + v_activity_progress) / 3.0;

    IF v_book_progress >= 1.0 AND v_other_items_progress_avg >= 0.8 THEN
        v_can_level_up := true;
    END IF;
    
    RETURN v_can_level_up;
END;
$$;

COMMENT ON FUNCTION public.check_level_up_eligibility(bigint) IS '자녀의 현재 활동량과 레벨업 기준을 비교하여 레벨업 가능 여부를 boolean으로 반환합니다. (읽기 100% 이상, 나머지 항목 평균 80% 이상)';
