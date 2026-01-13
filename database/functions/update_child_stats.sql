-- ============================================
-- Function: update_child_stats
-- Description: 미션 완료 후 자녀 통계(권수, 단어수, 스트릭)를 정확히 재계산
-- ============================================

CREATE OR REPLACE FUNCTION public.update_child_stats()
RETURNS TRIGGER AS $$
DECLARE
    v_logged_date DATE;
    v_previous_date DATE;
    v_current_streak INTEGER;
    v_longest_streak INTEGER;
BEGIN
    -- 1. 누적 읽은 권수 및 단어 수 업데이트 (mission_logs 참조)
    UPDATE public.children
    SET 
        total_books_read = (
            SELECT COUNT(DISTINCT book_id) 
            FROM public.mission_logs 
            WHERE child_id = NEW.child_id AND activity_type = 'reading'
        ),
        total_word_count = (
            SELECT COALESCE(SUM(b.word_count), 0)
            FROM public.mission_logs ml
            JOIN public.books b ON ml.book_id = b.id
            WHERE ml.child_id = NEW.child_id AND ml.activity_type = 'reading'
        )
    WHERE id = NEW.child_id;

    -- 2. 연속 학습일(Streak) 계산
    v_logged_date := DATE(NEW.logged_at);
    
    -- 현재 기록 이전에 마지막으로 활동한 날짜 조회
    SELECT DATE(MAX(logged_at)) INTO v_previous_date
    FROM public.mission_logs
    WHERE child_id = NEW.child_id
      AND id != NEW.id
      AND DATE(logged_at) < v_logged_date;

    -- 기존 자녀의 스트릭 값 가져오기
    SELECT current_streak, longest_streak INTO v_current_streak, v_longest_streak
    FROM public.children
    WHERE id = NEW.child_id;

    -- 연속일 체크 및 업데이트
    IF v_previous_date IS NULL OR v_previous_date = v_logged_date - INTERVAL '1 day' THEN
        v_current_streak := COALESCE(v_current_streak, 0) + 1;
    ELSIF v_previous_date < v_logged_date - INTERVAL '1 day' THEN
        v_current_streak := 1;
    END IF;

    -- 최장 스트릭 갱신
    IF v_current_streak > COALESCE(v_longest_streak, 0) THEN
        v_longest_streak := v_current_streak;
    END IF;

    UPDATE public.children
    SET 
        current_streak = v_current_streak,
        longest_streak = v_longest_streak,
        updated_at = NOW()
    WHERE id = NEW.child_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 재설정
DROP TRIGGER IF EXISTS trg_update_child_stats ON public.mission_logs;
CREATE TRIGGER trg_update_child_stats
AFTER INSERT ON public.mission_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_child_stats();