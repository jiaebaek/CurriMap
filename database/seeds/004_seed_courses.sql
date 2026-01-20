-- [B] 코스 데이터 업데이트 (백엔드 코드와 호환되는 코드 사용)
INSERT INTO courses (code, name, description) VALUES
('YELLOW_BASIC', '영유아기 옐로우 코스', '소리와 정서의 단계: 흘려듣기와 보드북 중심'),
('GREEN_PHONICS', '유치기 그린 코스', '습득의 황금기: 영상노출 + 리더스북 시작'),
('BLUE_READER', '초등 저학년 블루 코스', '읽기 독립의 단계: ORT & 얼리 챕터북'),
('PURPLE_CHAPTER', '초등 고학년 퍼플 코스', '심화 및 목표 달성: 챕터북 & 해리포터')
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name, 
    description = EXCLUDED.description;

-- [C] 상세 미션 및 목표 시간 설정 (course_levels)
-- 옐로우 코스
INSERT INTO course_levels (course_id, level_id, goal_hours, description)
SELECT c.id, l.id,
    CASE WHEN l.code = 'AGE_0' THEN 15 WHEN l.code = 'AGE_1' THEN 20 WHEN l.code = 'AGE_2' THEN 25 WHEN l.code = 'AGE_3' THEN 30 END,
    CASE WHEN l.code = 'AGE_0' THEN '📖 보드북 1권 읽어주기 (10분) | 🎵 영어 동요 배경음악 30분 | ✅ 목표: 영어 소리 거부감 제로'
         WHEN l.code = 'AGE_1' THEN '📖 헝겊책/팝업북 2권 노출 (15분) | 📺 마더구스 영상 10분 | ✅ 목표: 책과 친해지기'
         WHEN l.code = 'AGE_2' THEN '📖 한 줄짜리 그림책 3권 읽기 (20분) | 📺 슈퍼 심플 송 15분 | ✅ 목표: 짧은 단어와 리듬 인지'
         WHEN l.code = 'AGE_3' THEN '📖 그림책 5권 읽기 (25분) | 📺 영상 20분 | 🗣️ 생활 단어 3개 말해주기 | ✅ 목표: 소리와 사물 연결' END
FROM courses c CROSS JOIN levels l WHERE c.code = 'YELLOW_BASIC' AND l.code IN ('AGE_0', 'AGE_1', 'AGE_2', 'AGE_3')
ON CONFLICT (course_id, level_id) DO UPDATE SET goal_hours = EXCLUDED.goal_hours, description = EXCLUDED.description;

-- 그린 코스
INSERT INTO course_levels (course_id, level_id, goal_hours, description)
SELECT c.id, l.id,
    CASE WHEN l.code = 'AGE_4' THEN 50 WHEN l.code = 'AGE_5' THEN 60 WHEN l.code = 'AGE_6' THEN 70 END,
    CASE WHEN l.code = 'AGE_4' THEN '📖 그림책 3권 반복 읽기 | 📺 페파피그 수준 영상 30분 | 🎧 오디오 흘려듣기 20분 | ✅ 목표: 문장 소리 익숙해지기'
         WHEN l.code = 'AGE_5' THEN '📖 리더스북(ORT 1-2단계) 1권 | 🎵 파닉스 동요 1곡 | 📇 사이트워드 카드 1장 | ✅ 목표: Phonics 인지 시작'
         WHEN l.code = 'AGE_6' THEN '📖 리더스북(ORT 2-3단계) 음원 듣고 따라읽기 | 📝 파닉스 교재 2쪽 | 📺 영상 40분 | ✅ 목표: 스스로 읽기 준비' END
FROM courses c CROSS JOIN levels l WHERE c.code = 'GREEN_PHONICS' AND l.code IN ('AGE_4', 'AGE_5', 'AGE_6')
ON CONFLICT (course_id, level_id) DO UPDATE SET goal_hours = EXCLUDED.goal_hours, description = EXCLUDED.description;

-- 블루 코스
INSERT INTO course_levels (course_id, level_id, goal_hours, description)
SELECT c.id, l.id,
    CASE WHEN l.code = 'GRADE_1' THEN 80 WHEN l.code = 'GRADE_2' THEN 90 WHEN l.code = 'GRADE_3' THEN 100 END,
    CASE WHEN l.code = 'GRADE_1' THEN '📖 리더스북(ORT 4-5단계) 2권 읽기 | ✍️ 사이트워드 5개 쓰기 | 🗣️ 쉐도잉 5분 | ✅ 목표: 짧은 문장 스스로 읽기'
         WHEN l.code = 'GRADE_2' THEN '📖 리더스북(ORT 6-7단계) 1권 정독 | 📝 사이트워드 100개 복습 | 📺 애니메이션 1시간 | ✅ 목표: 읽기 유창성 확보'
         WHEN l.code = 'GRADE_3' THEN '📖 얼리 챕터북(Nate the Great) 1챕터 | 🔍 모르는 단어 문맥 유추 | 🎧 집중듣기 20분 | ✅ 목표: 글자 위주 책 전환' END
FROM courses c CROSS JOIN levels l WHERE c.code = 'BLUE_READER' AND l.code IN ('GRADE_1', 'GRADE_2', 'GRADE_3')
ON CONFLICT (course_id, level_id) DO UPDATE SET goal_hours = EXCLUDED.goal_hours, description = EXCLUDED.description;

-- 퍼플 코스
INSERT INTO course_levels (course_id, level_id, goal_hours, description)
SELECT c.id, l.id,
    CASE WHEN l.code = 'GRADE_4' THEN 120 WHEN l.code = 'GRADE_5' THEN 140 WHEN l.code = 'GRADE_6' THEN 160 END,
    CASE WHEN l.code = 'GRADE_4' THEN '📖 챕터북(Magic Tree House) 2챕터 | ✍️ 영어 일기 3문장 | 💬 화상영어 주 2회 | ✅ 목표: 100페이지 챕터북 완독'
         WHEN l.code = 'GRADE_5' THEN '📖 뉴베리 원서(Wonder) 5쪽 | 📺 TED Ed 시청 후 소감 | 💬 화상영어 20분 | ✅ 목표: 수준 높은 문학 접하기'
         WHEN l.code = 'GRADE_6' THEN '📖 해리포터 1챕터 읽기 & 오디오북 | 📺 CNN 10 뉴스 시청 | 💬 자유 주제 영어 수다 10분 | ✅ 목표: 해리포터 완독 & 프리토킹' END
FROM courses c CROSS JOIN levels l WHERE c.code = 'PURPLE_CHAPTER' AND l.code IN ('GRADE_4', 'GRADE_5', 'GRADE_6')
ON CONFLICT (course_id, level_id) DO UPDATE SET goal_hours = EXCLUDED.goal_hours, description = EXCLUDED.description;