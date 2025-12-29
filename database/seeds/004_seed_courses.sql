-- ============================================
-- Seed: 004_seed_courses.sql
-- Description: 코스 기본 데이터 삽입
-- ============================================

-- 옐로우 코스 (영유아기)
INSERT INTO courses (code, name, description) VALUES
('YELLOW_BASIC', '옐로우 코스', '0~3세 영유아를 위한 흘려듣기 중심 코스')
ON CONFLICT (code) DO NOTHING;

-- 그린 코스 (유치기)
INSERT INTO courses (code, name, description) VALUES
('GREEN_PHONICS', '그린 코스', '4~7세 유치기를 위한 파닉스 기초 코스')
ON CONFLICT (code) DO NOTHING;

-- 블루 코스 (초등 저학년)
INSERT INTO courses (code, name, description) VALUES
('BLUE_READER', '블루 코스', '초등 1~3학년을 위한 리더스북 코스')
ON CONFLICT (code) DO NOTHING;

-- 퍼플 코스 (초등 고학년)
INSERT INTO courses (code, name, description) VALUES
('PURPLE_CHAPTER', '퍼플 코스', '초등 4~6학년을 위한 챕터북 코스')
ON CONFLICT (code) DO NOTHING;

-- 코스 × 레벨별 설정 (옐로우 코스 예시)
INSERT INTO course_levels (course_id, level_id, goal_hours, description)
SELECT 
    c.id,
    l.id,
    CASE 
        WHEN l.code = 'AGE_0' THEN 50
        WHEN l.code = 'AGE_1' THEN 100
        WHEN l.code = 'AGE_2' THEN 150
        WHEN l.code = 'AGE_3' THEN 200
        ELSE NULL
    END as goal_hours,
    '흘려듣기 목표 시간'
FROM courses c
CROSS JOIN levels l
WHERE c.code = 'YELLOW_BASIC'
  AND l.code IN ('AGE_0', 'AGE_1', 'AGE_2', 'AGE_3')
ON CONFLICT (course_id, level_id) DO NOTHING;

-- 그린 코스 × 레벨별 설정
INSERT INTO course_levels (course_id, level_id, goal_hours, description)
SELECT 
    c.id,
    l.id,
    CASE 
        WHEN l.code = 'AGE_4' THEN 100
        WHEN l.code = 'AGE_5' THEN 150
        WHEN l.code = 'AGE_6' THEN 200
        ELSE NULL
    END as goal_hours,
    '파닉스 학습 목표 시간'
FROM courses c
CROSS JOIN levels l
WHERE c.code = 'GREEN_PHONICS'
  AND l.code IN ('AGE_4', 'AGE_5', 'AGE_6')
ON CONFLICT (course_id, level_id) DO NOTHING;


