-- ============================================
-- Migration: 003_create_themes_moods.sql
-- Description: 주제/분위기 태그 마스터 테이블 생성
-- ============================================

-- 주제 태그 마스터
CREATE TABLE IF NOT EXISTS themes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_themes_code ON themes(code);

COMMENT ON TABLE themes IS '주제 태그 마스터 (공룡, 자동차, 공주 등)';
COMMENT ON COLUMN themes.code IS '태그 코드 (예: DINOSAUR, CAR, PRINCESS 등)';
COMMENT ON COLUMN themes.name IS '표시 이름 (공룡, 자동차 등)';

-- 분위기 태그 마스터
CREATE TABLE IF NOT EXISTS moods (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moods_code ON moods(code);

COMMENT ON TABLE moods IS '분위기 태그 마스터 (웃긴, 감동, 무서운 등)';
COMMENT ON COLUMN moods.code IS '태그 코드 (예: FUNNY, HEARTWARMING, SCARY 등)';
COMMENT ON COLUMN moods.name IS '표시 이름 (웃긴, 감동 등)';


