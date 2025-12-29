-- ============================================
-- Function: update_child_stats_after_mission
-- Description: 미션 로그 INSERT 후 자녀 통계 자동 업데이트
-- ============================================

CREATE OR REPLACE FUNCTION update_child_stats_after_mission()
RETURNS TRIGGER AS $$
DECLARE
    v_word_count INTEGER;
    v_logged_date DATE;
    v_previous_date DATE;
    v_current_streak INTEGER;
    v_longest_streak INTEGER;
BEGIN
    -- activity_type이 'reading'이고 book_id가 있는 경우에만 통계 업데이트
    IF NEW.activity_type = 'reading' AND NEW.book_id IS NOT NULL THEN
        -- 1. 도서 단어 수 가져오기
        SELECT COALESCE(word_count, 0) INTO v_word_count
        FROM books
        WHERE id = NEW.book_id;
        
        -- 2. 누적 읽은 권수 증가 (중복 제거는 애플리케이션 레벨에서 처리)
        UPDATE children
        SET total_books_read = total_books_read + 1,
            total_word_count = total_word_count + v_word_count
        WHERE id = NEW.child_id;
        
        -- 3. 연속 학습일(Streak) 계산
        v_logged_date := DATE(NEW.logged_at);
        
        -- 이전 날짜의 마지막 로그 확인
        SELECT DATE(MAX(logged_at)) INTO v_previous_date
        FROM mission_logs
        WHERE child_id = NEW.child_id
          AND id != NEW.id
          AND DATE(logged_at) < v_logged_date;
        
        -- 현재 streak 가져오기
        SELECT current_streak INTO v_current_streak
        FROM children
        WHERE id = NEW.child_id;
        
        -- 연속일 체크
        IF v_previous_date IS NULL OR v_previous_date = v_logged_date - INTERVAL '1 day' THEN
            -- 연속일인 경우
            v_current_streak := COALESCE(v_current_streak, 0) + 1;
        ELSIF v_previous_date < v_logged_date - INTERVAL '1 day' THEN
            -- 연속이 끊긴 경우, 1로 리셋
            v_current_streak := 1;
        END IF;
        
        -- longest_streak 업데이트
        SELECT longest_streak INTO v_longest_streak
        FROM children
        WHERE id = NEW.child_id;
        
        IF v_current_streak > COALESCE(v_longest_streak, 0) THEN
            v_longest_streak := v_current_streak;
        END IF;
        
        -- children 테이블 업데이트
        UPDATE children
        SET current_streak = v_current_streak,
            longest_streak = v_longest_streak,
            updated_at = NOW()
        WHERE id = NEW.child_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거: mission_logs INSERT 후 자동 실행
DROP TRIGGER IF EXISTS trigger_update_child_stats ON mission_logs;
CREATE TRIGGER trigger_update_child_stats
    AFTER INSERT ON mission_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_child_stats_after_mission();

COMMENT ON FUNCTION update_child_stats_after_mission IS '미션 로그 INSERT 후 자녀 통계(누적 권수, 단어 수, Streak) 자동 업데이트';


