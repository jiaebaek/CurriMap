-- [A] 레벨 데이터 업데이트 (설계안의 상세 명칭과 AR 범위 반영)
INSERT INTO levels (code, name, min_ar, max_ar, description) VALUES
('AGE_0', '0세 (Ear Opening)', NULL, NULL, '영어 소리에 대한 거부감 제로'),
('AGE_1', '1세 (Book Touch)', NULL, NULL, '책과 친해지기'),
('AGE_2', '2세 (Rhythm & Song)', NULL, NULL, '짧은 단어와 리듬 인지'),
('AGE_3', '3세 (Visual Matching)', NULL, NULL, '소리와 사물 연결'),
('AGE_4', '4세 (Story Immersion)', 0.0, 1.0, '문장 소리에 익숙해지기'),
('AGE_5', '5세 (Phonics Awareness)', 0.5, 1.5, '알파벳 소리값(Phonics) 인지 시작'),
('AGE_6', '6세 (Reading Readiness)', 1.0, 2.0, '스스로 읽기 준비'),
('GRADE_1', '초1 (Reading Jump)', 1.5, 2.5, '짧은 문장 스스로 읽기'),
('GRADE_2', '초2 (Fluency Building)', 2.0, 3.0, '읽기 유창성 확보 및 사이트워드 완성'),
('GRADE_3', '초3 (Early Chapter Books)', 2.5, 3.5, '그림책에서 글자 위주 책으로 전환'),
('GRADE_4', '초4 (Chapter Book Diva)', 3.0, 4.5, '100페이지 내외 챕터북 완독'),
('GRADE_5', '초5 (Deep Reading & Newbery)', 4.0, 6.0, '뉴베리 수상작 등 수준 높은 문학 접하기'),
('GRADE_6', '초6 (Final Goal: Harry Potter)', 5.5, 7.0, '해리포터 원서 완독 및 자유 회화')
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name, 
    min_ar = EXCLUDED.min_ar, 
    max_ar = EXCLUDED.max_ar, 
    description = EXCLUDED.description;

