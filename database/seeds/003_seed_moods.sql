-- ============================================
-- Seed: 003_seed_moods.sql
-- Description: 분위기 태그 기본 데이터 삽입
-- ============================================

INSERT INTO moods (code, name) VALUES
('FUNNY', '웃긴'),
('HEARTWARMING', '감동적인'),
('EXCITING', '흥미진진한'),
('PEACEFUL', '평화로운'),
('EDUCATIONAL', '교육적인'),
('ADVENTUROUS', '모험적인'),
('MYSTERIOUS', '신비로운'),
('SCARY', '무서운'),
('HAPPY', '행복한'),
('SAD', '슬픈'),
('BRAVE', '용감한'),
('CLEVER', '똑똑한')
ON CONFLICT (code) DO NOTHING;


