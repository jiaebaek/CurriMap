-- ============================================
-- Migration: 004_create_courses.sql
-- Description: 코스 정의 및 코스-레벨 관계 테이블 생성
-- ============================================

-- 코스 정의
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);

COMMENT ON TABLE courses IS '코스 정의 (예: 옐로우 코스)';
COMMENT ON COLUMN courses.code IS '코스 코드 (예: YELLOW_BASIC)';
COMMENT ON COLUMN courses.name IS '코스 이름 (예: 옐로우 코스)';

-- 코스 × 레벨별 설정
CREATE TABLE IF NOT EXISTS course_levels (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    level_id INTEGER NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
    goal_hours INTEGER,
    description TEXT,
    UNIQUE(course_id, level_id)
);

CREATE INDEX IF NOT EXISTS idx_course_levels_course ON course_levels(course_id);
CREATE INDEX IF NOT EXISTS idx_course_levels_level ON course_levels(level_id);

COMMENT ON TABLE course_levels IS '코스 × 레벨별 목표/설정 (예: 옐로우 코스 + AR 0~1 = 흘려듣기 100시간)';
COMMENT ON COLUMN course_levels.goal_hours IS '목표 시간 (예: 흘려듣기 100/200시간)';


