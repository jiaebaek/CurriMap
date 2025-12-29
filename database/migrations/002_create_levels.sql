-- ============================================
-- Migration: 002_create_levels.sql
-- Description: 레벨 그룹 정의 테이블 생성
-- ============================================

CREATE TABLE IF NOT EXISTS levels (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    min_ar NUMERIC(3,1),
    max_ar NUMERIC(3,1),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_levels_code ON levels(code);
CREATE INDEX IF NOT EXISTS idx_levels_ar_range ON levels(min_ar, max_ar);

COMMENT ON TABLE levels IS '레벨 그룹 정의 (예: Pre-K, AR 0~1, AR 1~2 등)';
COMMENT ON COLUMN levels.code IS '레벨 코드 (예: PREK, AR_0_1, GRADE_1 등)';
COMMENT ON COLUMN levels.min_ar IS 'AR 최소값';
COMMENT ON COLUMN levels.max_ar IS 'AR 최대값';


