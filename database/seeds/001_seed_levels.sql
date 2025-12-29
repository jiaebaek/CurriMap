-- ============================================
-- Seed: 001_seed_levels.sql
-- Description: 레벨 기본 데이터 삽입
-- ============================================

-- 영유아 레벨 (0~3세)
INSERT INTO levels (code, name, min_ar, max_ar, description) VALUES
('AGE_0', '0세 (영아기)', NULL, NULL, '영어 소리 노출 시작 단계'),
('AGE_1', '1세 (영아기)', NULL, NULL, '영어 소리에 반응하는 단계'),
('AGE_2', '2세 (유아기)', NULL, NULL, '영어 동요/마더구스 즐기는 단계'),
('AGE_3', '3세 (유아기)', NULL, NULL, '영어 그림책에 관심 보이는 단계')
ON CONFLICT (code) DO NOTHING;

-- 유치기 레벨 (4~7세)
INSERT INTO levels (code, name, min_ar, max_ar, description) VALUES
('AGE_4', '4세 (유치기)', 0.0, 0.5, '알파벳 인지 시작, 단어 노출'),
('AGE_5', '5세 (유치기)', 0.5, 1.0, '파닉스 인지, 사이트워드 시작'),
('AGE_6', '6세 (유치기)', 1.0, 1.5, '리더스북 1~2단계 읽기 가능')
ON CONFLICT (code) DO NOTHING;

-- 초등 저학년 레벨 (1~3학년)
INSERT INTO levels (code, name, min_ar, max_ar, description) VALUES
('GRADE_1', '초등 1학년', 1.5, 2.0, '리더스북 3~4단계, 짧은 문장 읽기'),
('GRADE_2', '초등 2학년', 2.0, 2.5, '리더스북 5~6단계, 챕터북 진입 준비'),
('GRADE_3', '초등 3학년', 2.5, 3.0, '챕터북 독립 읽기 시작')
ON CONFLICT (code) DO NOTHING;

-- 초등 고학년 레벨 (4~6학년)
INSERT INTO levels (code, name, min_ar, max_ar, description) VALUES
('GRADE_4', '초등 4학년', 3.0, 3.5, '챕터북 독립 읽기, 문장 이해력 향상'),
('GRADE_5', '초등 5학년', 3.5, 4.0, '중급 챕터북, 독해력 강화'),
('GRADE_6', '초등 6학년', 4.0, 5.0, '고급 챕터북, 원서 독서 습관 형성')
ON CONFLICT (code) DO NOTHING;


