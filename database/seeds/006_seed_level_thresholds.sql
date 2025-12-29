-- ============================================
-- Seed: 006_seed_level_thresholds.sql
-- Description: 연령 그룹별 점수 구간 → 레벨 매핑 데이터 삽입
-- ============================================

-- 0~3세 (총점 0~6점, 3문항 × 2점)
INSERT INTO level_thresholds (age_group, level_id, min_score, max_score)
SELECT 'infant', id, 0, 1 FROM levels WHERE code = 'AGE_0'
ON CONFLICT (age_group, level_id) DO NOTHING;

INSERT INTO level_thresholds (age_group, level_id, min_score, max_score)
SELECT 'infant', id, 2, 3 FROM levels WHERE code = 'AGE_1'
ON CONFLICT (age_group, level_id) DO NOTHING;

INSERT INTO level_thresholds (age_group, level_id, min_score, max_score)
SELECT 'infant', id, 4, 5 FROM levels WHERE code = 'AGE_2'
ON CONFLICT (age_group, level_id) DO NOTHING;

INSERT INTO level_thresholds (age_group, level_id, min_score, max_score)
SELECT 'infant', id, 6, 6 FROM levels WHERE code = 'AGE_3'
ON CONFLICT (age_group, level_id) DO NOTHING;

-- 4~7세 (총점 0~11점, 4문항)
INSERT INTO level_thresholds (age_group, level_id, min_score, max_score)
SELECT 'preschool', id, 0, 3 FROM levels WHERE code = 'AGE_4'
ON CONFLICT (age_group, level_id) DO NOTHING;

INSERT INTO level_thresholds (age_group, level_id, min_score, max_score)
SELECT 'preschool', id, 4, 7 FROM levels WHERE code = 'AGE_5'
ON CONFLICT (age_group, level_id) DO NOTHING;

INSERT INTO level_thresholds (age_group, level_id, min_score, max_score)
SELECT 'preschool', id, 8, 11 FROM levels WHERE code = 'AGE_6'
ON CONFLICT (age_group, level_id) DO NOTHING;

-- 초등 1~3학년 (총점 0~12점, 4문항)
INSERT INTO level_thresholds (age_group, level_id, min_score, max_score)
SELECT 'lower_elem', id, 0, 4 FROM levels WHERE code = 'GRADE_1'
ON CONFLICT (age_group, level_id) DO NOTHING;

INSERT INTO level_thresholds (age_group, level_id, min_score, max_score)
SELECT 'lower_elem', id, 5, 8 FROM levels WHERE code = 'GRADE_2'
ON CONFLICT (age_group, level_id) DO NOTHING;

INSERT INTO level_thresholds (age_group, level_id, min_score, max_score)
SELECT 'lower_elem', id, 9, 12 FROM levels WHERE code = 'GRADE_3'
ON CONFLICT (age_group, level_id) DO NOTHING;

-- 초등 4~6학년 (총점 0~12점, 4문항)
INSERT INTO level_thresholds (age_group, level_id, min_score, max_score)
SELECT 'upper_elem', id, 0, 4 FROM levels WHERE code = 'GRADE_4'
ON CONFLICT (age_group, level_id) DO NOTHING;

INSERT INTO level_thresholds (age_group, level_id, min_score, max_score)
SELECT 'upper_elem', id, 5, 8 FROM levels WHERE code = 'GRADE_5'
ON CONFLICT (age_group, level_id) DO NOTHING;

INSERT INTO level_thresholds (age_group, level_id, min_score, max_score)
SELECT 'upper_elem', id, 9, 12 FROM levels WHERE code = 'GRADE_6'
ON CONFLICT (age_group, level_id) DO NOTHING;


