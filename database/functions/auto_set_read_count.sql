-- ============================================
-- Function: auto_set_read_count
-- Description: mission_logs INSERT 시 read_count 자동 설정
-- ============================================

CREATE OR REPLACE FUNCTION auto_set_read_count()
RETURNS TRIGGER AS $$
BEGIN
    -- activity_type이 'reading'이고 book_id가 있는 경우에만 read_count 설정
    IF NEW.activity_type = 'reading' AND NEW.book_id IS NOT NULL THEN
        -- read_count가 명시적으로 설정되지 않은 경우에만 자동 계산
        IF NEW.read_count IS NULL OR NEW.read_count = 1 THEN
            NEW.read_count := get_next_read_count(NEW.child_id, NEW.book_id);
        END IF;
    ELSE
        -- reading이 아닌 경우 read_count는 1로 고정
        NEW.read_count := 1;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거: mission_logs INSERT 전에 실행
DROP TRIGGER IF EXISTS trigger_auto_set_read_count ON mission_logs;
CREATE TRIGGER trigger_auto_set_read_count
    BEFORE INSERT ON mission_logs
    FOR EACH ROW
    EXECUTE FUNCTION auto_set_read_count();

COMMENT ON FUNCTION auto_set_read_count IS 'mission_logs INSERT 시 read_count 자동 설정';


