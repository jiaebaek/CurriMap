-- 0~3세 (총점 0~6점)
INSERT INTO level_thresholds (age_group, level_id, min_score, max_score) VALUES
('infant', (SELECT id FROM levels WHERE code = 'AGE_0'), 0, 1),
('infant', (SELECT id FROM levels WHERE code = 'AGE_1'), 2, 3),
('infant', (SELECT id FROM levels WHERE code = 'AGE_2'), 4, 5),
('infant', (SELECT id FROM levels WHERE code = 'AGE_3'), 6, 6);

-- 4~7세 (총점 0~11점)
INSERT INTO level_thresholds (age_group, level_id, min_score, max_score) VALUES
('preschool', (SELECT id FROM levels WHERE code = 'AGE_4'), 0, 3),
('preschool', (SELECT id FROM levels WHERE code = 'AGE_5'), 4, 7),
('preschool', (SELECT id FROM levels WHERE code = 'AGE_6'), 8, 11);

-- 초등 1~3학년 (총점 0~12점)
INSERT INTO level_thresholds (age_group, level_id, min_score, max_score) VALUES
('lower_elem', (SELECT id FROM levels WHERE code = 'GRADE_1'), 0, 4),
('lower_elem', (SELECT id FROM levels WHERE code = 'GRADE_2'), 5, 8),
('lower_elem', (SELECT id FROM levels WHERE code = 'GRADE_3'), 9, 12);

-- 초등 4~6학년 (총점 0~12점)
INSERT INTO level_thresholds (age_group, level_id, min_score, max_score) VALUES
('upper_elem', (SELECT id FROM levels WHERE code = 'GRADE_4'), 0, 4),
('upper_elem', (SELECT id FROM levels WHERE code = 'GRADE_5'), 5, 8),
('upper_elem', (SELECT id FROM levels WHERE code = 'GRADE_6'), 9, 12);