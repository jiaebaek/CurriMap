-- ============================================
-- Seed: 005_seed_onboarding_questions.sql
-- Description: 연령별 온보딩 질문 및 선택지 데이터 삽입
-- ============================================

-- ============================================
-- 0~3세 (영유아기) 질문
-- ============================================

-- 질문 1: 영어 소리 노출 경험
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) VALUES
('infant', 'INFANT_AUDIO_EXPOSURE', '아이에게 영어 동요나 마더구스를 들려준 적이 있나요?', 1)
ON CONFLICT (question_code) DO NOTHING;

INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '없음', 0, 1 FROM onboarding_questions WHERE question_code = 'INFANT_AUDIO_EXPOSURE'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '가끔', 1, 2 FROM onboarding_questions WHERE question_code = 'INFANT_AUDIO_EXPOSURE'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '매일 30분 이상', 2, 3 FROM onboarding_questions WHERE question_code = 'INFANT_AUDIO_EXPOSURE'
ON CONFLICT DO NOTHING;

-- 질문 2: 반응도
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) VALUES
('infant', 'INFANT_REACTION', '영어 노래가 나올 때 아이가 흥얼거리거나 율동을 하나요?', 2)
ON CONFLICT (question_code) DO NOTHING;

INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '전혀 없음', 0, 1 FROM onboarding_questions WHERE question_code = 'INFANT_REACTION'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '리듬을 탐', 1, 2 FROM onboarding_questions WHERE question_code = 'INFANT_REACTION'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '따라 하려고 함', 2, 3 FROM onboarding_questions WHERE question_code = 'INFANT_REACTION'
ON CONFLICT DO NOTHING;

-- 질문 3: 상호작용
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) VALUES
('infant', 'INFANT_BOOK_INTERACTION', '영어 그림책을 보여주면 아이가 집중해서 보나요?', 3)
ON CONFLICT (question_code) DO NOTHING;

INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '도망감', 0, 1 FROM onboarding_questions WHERE question_code = 'INFANT_BOOK_INTERACTION'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '그림만 봄', 1, 2 FROM onboarding_questions WHERE question_code = 'INFANT_BOOK_INTERACTION'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '짧게 집중함', 2, 3 FROM onboarding_questions WHERE question_code = 'INFANT_BOOK_INTERACTION'
ON CONFLICT DO NOTHING;

-- ============================================
-- 4~7세 (유치기) 질문
-- ============================================

-- 질문 1: 영상 시청 태도
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) VALUES
('preschool', 'PRESCHOOL_VIDEO_ATTITUDE', '영어 영상을 자막 없이 보여주었을 때 아이의 반응은?', 1)
ON CONFLICT (question_code) DO NOTHING;

INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '거부함', 0, 1 FROM onboarding_questions WHERE question_code = 'PRESCHOOL_VIDEO_ATTITUDE'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '그림만 봄', 1, 2 FROM onboarding_questions WHERE question_code = 'PRESCHOOL_VIDEO_ATTITUDE'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '내용을 어느 정도 유추하며 즐겁게 봄', 3, 3 FROM onboarding_questions WHERE question_code = 'PRESCHOOL_VIDEO_ATTITUDE'
ON CONFLICT DO NOTHING;

-- 질문 2: 어휘력
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) VALUES
('preschool', 'PRESCHOOL_VOCABULARY', '사과를 보고 Apple이라고 말하거나, Sit down 같은 간단한 지시어를 알아듣나요?', 2)
ON CONFLICT (question_code) DO NOTHING;

INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '전혀 모름', 0, 1 FROM onboarding_questions WHERE question_code = 'PRESCHOOL_VOCABULARY'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '5개 미만', 1, 2 FROM onboarding_questions WHERE question_code = 'PRESCHOOL_VOCABULARY'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '10개 이상', 3, 3 FROM onboarding_questions WHERE question_code = 'PRESCHOOL_VOCABULARY'
ON CONFLICT DO NOTHING;

-- 질문 3: 문자 인지
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) VALUES
('preschool', 'PRESCHOOL_ALPHABET', '알파벳 대문자와 소문자를 구별할 수 있나요?', 3)
ON CONFLICT (question_code) DO NOTHING;

INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '아직 몰라요', 0, 1 FROM onboarding_questions WHERE question_code = 'PRESCHOOL_ALPHABET'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '노래로만 알아요', 1, 2 FROM onboarding_questions WHERE question_code = 'PRESCHOOL_ALPHABET'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '절반 이상 알아요', 2, 3 FROM onboarding_questions WHERE question_code = 'PRESCHOOL_ALPHABET'
ON CONFLICT DO NOTHING;

-- 질문 4: 읽기 시도
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) VALUES
('preschool', 'PRESCHOOL_READING_ATTEMPT', '아는 단어가 나오면 스스로 읽으려고 하나요?', 4)
ON CONFLICT (question_code) DO NOTHING;

INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '아니오', 0, 1 FROM onboarding_questions WHERE question_code = 'PRESCHOOL_READING_ATTEMPT'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '가끔 시도함', 2, 2 FROM onboarding_questions WHERE question_code = 'PRESCHOOL_READING_ATTEMPT'
ON CONFLICT DO NOTHING;

-- ============================================
-- 초등 1~3학년 (저학년) 질문
-- ============================================

-- 질문 1: 파닉스 수준
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) VALUES
('lower_elem', 'LOWER_PHONICS_LEVEL', '모르는 단어를 소리 내어 읽을 수 있나요?', 1)
ON CONFLICT (question_code) DO NOTHING;

INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '못 읽음', 0, 1 FROM onboarding_questions WHERE question_code = 'LOWER_PHONICS_LEVEL'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '규칙을 배우는 중', 2, 2 FROM onboarding_questions WHERE question_code = 'LOWER_PHONICS_LEVEL'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '70% 이상 읽음', 3, 3 FROM onboarding_questions WHERE question_code = 'LOWER_PHONICS_LEVEL'
ON CONFLICT DO NOTHING;

-- 질문 2: 읽기 경험
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) VALUES
('lower_elem', 'LOWER_READING_EXPERIENCE', '리더스북(예: ORT)을 스스로 읽어본 적이 있나요? 있다면 몇 단계인가요?', 2)
ON CONFLICT (question_code) DO NOTHING;

INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '없음', 0, 1 FROM onboarding_questions WHERE question_code = 'LOWER_READING_EXPERIENCE'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '1~2단계', 1, 2 FROM onboarding_questions WHERE question_code = 'LOWER_READING_EXPERIENCE'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '3단계 이상', 3, 3 FROM onboarding_questions WHERE question_code = 'LOWER_READING_EXPERIENCE'
ON CONFLICT DO NOTHING;

-- 질문 3: 사이트워드
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) VALUES
('lower_elem', 'LOWER_SIGHT_WORDS', 'I, The, He, She 같은 기본 단어를 바로 읽나요?', 3)
ON CONFLICT (question_code) DO NOTHING;

INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '버벅임', 1, 1 FROM onboarding_questions WHERE question_code = 'LOWER_SIGHT_WORDS'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '대부분 읽음', 3, 2 FROM onboarding_questions WHERE question_code = 'LOWER_SIGHT_WORDS'
ON CONFLICT DO NOTHING;

-- 질문 4: 노출 시간
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) VALUES
('lower_elem', 'LOWER_EXPOSURE_TIME', '하루 평균 영어 노출(영상/책) 시간은?', 4)
ON CONFLICT (question_code) DO NOTHING;

INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '30분 미만', 1, 1 FROM onboarding_questions WHERE question_code = 'LOWER_EXPOSURE_TIME'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '1시간 내외', 2, 2 FROM onboarding_questions WHERE question_code = 'LOWER_EXPOSURE_TIME'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '2시간 이상', 3, 3 FROM onboarding_questions WHERE question_code = 'LOWER_EXPOSURE_TIME'
ON CONFLICT DO NOTHING;

-- ============================================
-- 초등 4~6학년 (고학년) 질문
-- ============================================

-- 질문 1: 독서 습관
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) VALUES
('upper_elem', 'UPPER_READING_HABIT', '한 페이지에 5~10문장 정도 있는 챕터북을 혼자 읽을 수 있나요?', 1)
ON CONFLICT (question_code) DO NOTHING;

INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '어려움', 0, 1 FROM onboarding_questions WHERE question_code = 'UPPER_READING_HABIT'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '도움 필요', 2, 2 FROM onboarding_questions WHERE question_code = 'UPPER_READING_HABIT'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '혼자 완독 가능', 3, 3 FROM onboarding_questions WHERE question_code = 'UPPER_READING_HABIT'
ON CONFLICT DO NOTHING;

-- 질문 2: 청취력
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) VALUES
('upper_elem', 'UPPER_LISTENING_COMPREHENSION', '자막 없는 영어 영상을 시청한 후 줄거리를 한국어로 요약할 수 있나요?', 2)
ON CONFLICT (question_code) DO NOTHING;

INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '전혀 못함', 0, 1 FROM onboarding_questions WHERE question_code = 'UPPER_LISTENING_COMPREHENSION'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '절반 정도', 2, 2 FROM onboarding_questions WHERE question_code = 'UPPER_LISTENING_COMPREHENSION'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '완벽히 요약', 3, 3 FROM onboarding_questions WHERE question_code = 'UPPER_LISTENING_COMPREHENSION'
ON CONFLICT DO NOTHING;

-- 질문 3: 회화 경험
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) VALUES
('upper_elem', 'UPPER_SPEAKING_ABILITY', '외국인을 만났을 때 간단한 자기소개나 의사표현이 가능한가요?', 3)
ON CONFLICT (question_code) DO NOTHING;

INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '거부감 있음', 0, 1 FROM onboarding_questions WHERE question_code = 'UPPER_SPEAKING_ABILITY'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '단어로 말함', 2, 2 FROM onboarding_questions WHERE question_code = 'UPPER_SPEAKING_ABILITY'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, '문장으로 말함', 3, 3 FROM onboarding_questions WHERE question_code = 'UPPER_SPEAKING_ABILITY'
ON CONFLICT DO NOTHING;

-- 질문 4: 학습 이력
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) VALUES
('upper_elem', 'UPPER_LEARNING_HISTORY', '지난 1년간 꾸준히 영어 원서를 읽어왔나요?', 4)
ON CONFLICT (question_code) DO NOTHING;

INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, 'No', 0, 1 FROM onboarding_questions WHERE question_code = 'UPPER_LEARNING_HISTORY'
ON CONFLICT DO NOTHING;
INSERT INTO question_options (question_id, option_text, score, option_order)
SELECT id, 'Yes', 3, 2 FROM onboarding_questions WHERE question_code = 'UPPER_LEARNING_HISTORY'
ON CONFLICT DO NOTHING;


