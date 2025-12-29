-- ============================================
-- Function: get_next_read_count
-- Description: 같은 child_id + book_id 조합에서의 다음 회독 횟수 계산
-- ============================================

CREATE OR REPLACE FUNCTION get_next_read_count(
    p_child_id BIGINT,
    p_book_id BIGINT
)
RETURNS INTEGER AS $$
DECLARE
    v_max_count INTEGER;
BEGIN
    -- 같은 child_id + book_id 조합에서 최대 read_count 조회
    SELECT COALESCE(MAX(read_count), 0) INTO v_max_count
    FROM mission_logs
    WHERE child_id = p_child_id
      AND book_id = p_book_id;
    
    -- 다음 회독 횟수 반환
    RETURN v_max_count + 1;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_next_read_count IS '같은 child_id + book_id 조합에서의 다음 회독 횟수 계산';


