-- ============================================
-- Seed: 002_seed_themes.sql
-- Description: 주제 태그 기본 데이터 삽입
-- ============================================

INSERT INTO themes (code, name) VALUES
('DINOSAUR', '공룡'),
('CAR', '자동차/탈것'),
('PRINCESS', '공주'),
('ANIMAL', '동물'),
('SPACE', '우주'),
('FOOD', '음식/요리'),
('DETECTIVE', '탐정/미스터리'),
('MAGIC', '마법'),
('FRIENDSHIP', '우정'),
('FAMILY', '가족'),
('SCHOOL', '학교'),
('NATURE', '자연'),
('SPORTS', '운동'),
('MUSIC', '음악'),
('ART', '예술'),
('SCIENCE', '과학'),
('HISTORY', '역사'),
('ADVENTURE', '모험'),
('FAIRY_TALE', '동화'),
('FANTASY', '판타지')
ON CONFLICT (code) DO NOTHING;


