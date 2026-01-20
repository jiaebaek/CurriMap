-- [1.1] 점수 제약 조건 수정 (기존 0~3점 제한 삭제 및 확장)
ALTER TABLE question_options DROP CONSTRAINT IF EXISTS question_options_score_check;
ALTER TABLE question_options ADD CONSTRAINT question_options_score_check CHECK (score >= 0 AND score <= 10);

-- [1.2] 기존 데이터 초기화 (중복 삽입 방지)
TRUNCATE onboarding_responses CASCADE;
TRUNCATE question_options CASCADE;
TRUNCATE onboarding_questions CASCADE;
TRUNCATE level_thresholds CASCADE;

-- ============================================
-- 2.1 0~3세 (영유아기: infant)
-- ============================================
-- 질문 1
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) 
VALUES ('infant', 'INFANT_AUDIO_EXPOSURE', '아이에게 영어 동요나 마더구스를 들려준 적이 있나요?', 1);
INSERT INTO question_options (question_id, option_text, score, option_order) VALUES
((SELECT id FROM onboarding_questions WHERE question_code = 'INFANT_AUDIO_EXPOSURE'), '없음', 0, 1),
((SELECT id FROM onboarding_questions WHERE question_code = 'INFANT_AUDIO_EXPOSURE'), '가끔', 1, 2),
((SELECT id FROM onboarding_questions WHERE question_code = 'INFANT_AUDIO_EXPOSURE'), '매일 30분 이상', 2, 3);

-- 질문 2
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) 
VALUES ('infant', 'INFANT_REACTION', '영어 노래가 나올 때 아이가 흥얼거리거나 율동을 하나요?', 2);
INSERT INTO question_options (question_id, option_text, score, option_order) VALUES
((SELECT id FROM onboarding_questions WHERE question_code = 'INFANT_REACTION'), '전혀 없음', 0, 1),
((SELECT id FROM onboarding_questions WHERE question_code = 'INFANT_REACTION'), '리듬을 탐', 1, 2),
((SELECT id FROM onboarding_questions WHERE question_code = 'INFANT_REACTION'), '따라 하려고 함', 2, 3);

-- 질문 3
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) 
VALUES ('infant', 'INFANT_BOOK_INTERACTION', '영어 그림책을 보여주면 아이가 집중해서 보나요?', 3);
INSERT INTO question_options (question_id, option_text, score, option_order) VALUES
((SELECT id FROM onboarding_questions WHERE question_code = 'INFANT_BOOK_INTERACTION'), '도망감', 0, 1),
((SELECT id FROM onboarding_questions WHERE question_code = 'INFANT_BOOK_INTERACTION'), '그림만 봄', 1, 2),
((SELECT id FROM onboarding_questions WHERE question_code = 'INFANT_BOOK_INTERACTION'), '짧게 집중함', 2, 3);

-- ============================================
-- 2.2 4~7세 (유치기: preschool)
-- ============================================
-- 질문 1
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) 
VALUES ('preschool', 'PRESCHOOL_VIDEO_ATTITUDE', '영어 영상을 자막 없이 보여주었을 때 아이의 반응은?', 1);
INSERT INTO question_options (question_id, option_text, score, option_order) VALUES
((SELECT id FROM onboarding_questions WHERE question_code = 'PRESCHOOL_VIDEO_ATTITUDE'), '거부함', 0, 1),
((SELECT id FROM onboarding_questions WHERE question_code = 'PRESCHOOL_VIDEO_ATTITUDE'), '그림만 봄', 1, 2),
((SELECT id FROM onboarding_questions WHERE question_code = 'PRESCHOOL_VIDEO_ATTITUDE'), '내용을 어느 정도 유추하며 즐겁게 봄', 3, 3);

-- 질문 2
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) 
VALUES ('preschool', 'PRESCHOOL_VOCABULARY', '사과를 보고 Apple이라고 말하거나, Sit down 같은 간단한 지시어를 알아듣나요?', 2);
INSERT INTO question_options (question_id, option_text, score, option_order) VALUES
((SELECT id FROM onboarding_questions WHERE question_code = 'PRESCHOOL_VOCABULARY'), '전혀 모름', 0, 1),
((SELECT id FROM onboarding_questions WHERE question_code = 'PRESCHOOL_VOCABULARY'), '5개 미만', 1, 2),
((SELECT id FROM onboarding_questions WHERE question_code = 'PRESCHOOL_VOCABULARY'), '10개 이상', 3, 3);

-- 질문 3
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) 
VALUES ('preschool', 'PRESCHOOL_ALPHABET', '알파벳 대문자와 소문자를 구별할 수 있나요?', 3);
INSERT INTO question_options (question_id, option_text, score, option_order) VALUES
((SELECT id FROM onboarding_questions WHERE question_code = 'PRESCHOOL_ALPHABET'), '아직 몰라요', 0, 1),
((SELECT id FROM onboarding_questions WHERE question_code = 'PRESCHOOL_ALPHABET'), '노래로만 알아요', 1, 2),
((SELECT id FROM onboarding_questions WHERE question_code = 'PRESCHOOL_ALPHABET'), '절반 이상 알아요', 2, 3);

-- 질문 4
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) 
VALUES ('preschool', 'PRESCHOOL_READING_ATTEMPT', '아는 단어가 나오면 스스로 읽으려고 하나요?', 4);
INSERT INTO question_options (question_id, option_text, score, option_order) VALUES
((SELECT id FROM onboarding_questions WHERE question_code = 'PRESCHOOL_READING_ATTEMPT'), '아니오', 0, 1),
((SELECT id FROM onboarding_questions WHERE question_code = 'PRESCHOOL_READING_ATTEMPT'), '가끔 시도함', 2, 2);

-- ============================================
-- 2.3 초등 1~3학년 (저학년: lower_elem)
-- ============================================
-- 질문 1
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) 
VALUES ('lower_elem', 'LOWER_PHONICS_LEVEL', '모르는 단어를 소리 내어 읽을 수 있나요?', 1);
INSERT INTO question_options (question_id, option_text, score, option_order) VALUES
((SELECT id FROM onboarding_questions WHERE question_code = 'LOWER_PHONICS_LEVEL'), '못 읽음', 0, 1),
((SELECT id FROM onboarding_questions WHERE question_code = 'LOWER_PHONICS_LEVEL'), '규칙을 배우는 중', 2, 2),
((SELECT id FROM onboarding_questions WHERE question_code = 'LOWER_PHONICS_LEVEL'), '70% 이상 읽음', 3, 3);

-- 질문 2
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) 
VALUES ('lower_elem', 'LOWER_READING_EXPERIENCE', '리더스북(예: ORT)을 스스로 읽어본 적이 있나요? 있다면 몇 단계인가요?', 2);
INSERT INTO question_options (question_id, option_text, score, option_order) VALUES
((SELECT id FROM onboarding_questions WHERE question_code = 'LOWER_READING_EXPERIENCE'), '없음', 0, 1),
((SELECT id FROM onboarding_questions WHERE question_code = 'LOWER_READING_EXPERIENCE'), '1~2단계', 1, 2),
((SELECT id FROM onboarding_questions WHERE question_code = 'LOWER_READING_EXPERIENCE'), '3단계 이상', 3, 3);

-- 질문 3
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) 
VALUES ('lower_elem', 'LOWER_SIGHT_WORDS', 'I, The, He, She 같은 기본 단어를 바로 읽나요?', 3);
INSERT INTO question_options (question_id, option_text, score, option_order) VALUES
((SELECT id FROM onboarding_questions WHERE question_code = 'LOWER_SIGHT_WORDS'), '버벅임', 1, 1),
((SELECT id FROM onboarding_questions WHERE question_code = 'LOWER_SIGHT_WORDS'), '대부분 읽음', 3, 2);

-- 질문 4
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) 
VALUES ('lower_elem', 'LOWER_EXPOSURE_TIME', '하루 평균 영어 노출(영상/책) 시간은?', 4);
INSERT INTO question_options (question_id, option_text, score, option_order) VALUES
((SELECT id FROM onboarding_questions WHERE question_code = 'LOWER_EXPOSURE_TIME'), '30분 미만', 1, 1),
((SELECT id FROM onboarding_questions WHERE question_code = 'LOWER_EXPOSURE_TIME'), '1시간 내외', 2, 2),
((SELECT id FROM onboarding_questions WHERE question_code = 'LOWER_EXPOSURE_TIME'), '2시간 이상', 3, 3);

-- ============================================
-- 2.4 초등 4~6학년 (고학년: upper_elem)
-- ============================================
-- 질문 1
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) 
VALUES ('upper_elem', 'UPPER_READING_HABIT', '한 페이지에 5~10문장 정도 있는 챕터북을 혼자 읽을 수 있나요?', 1);
INSERT INTO question_options (question_id, option_text, score, option_order) VALUES
((SELECT id FROM onboarding_questions WHERE question_code = 'UPPER_READING_HABIT'), '어려움', 0, 1),
((SELECT id FROM onboarding_questions WHERE question_code = 'UPPER_READING_HABIT'), '도움 필요', 2, 2),
((SELECT id FROM onboarding_questions WHERE question_code = 'UPPER_READING_HABIT'), '혼자 완독 가능', 3, 3);

-- 질문 2
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) 
VALUES ('upper_elem', 'UPPER_LISTENING_COMPREHENSION', '자막 없는 영어 영상을 시청한 후 줄거리를 한국어로 요약할 수 있나요?', 2);
INSERT INTO question_options (question_id, option_text, score, option_order) VALUES
((SELECT id FROM onboarding_questions WHERE question_code = 'UPPER_LISTENING_COMPREHENSION'), '전혀 못함', 0, 1),
((SELECT id FROM onboarding_questions WHERE question_code = 'UPPER_LISTENING_COMPREHENSION'), '절반 정도', 2, 2),
((SELECT id FROM onboarding_questions WHERE question_code = 'UPPER_LISTENING_COMPREHENSION'), '완벽히 요약', 3, 3);

-- 질문 3
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) 
VALUES ('upper_elem', 'UPPER_SPEAKING_ABILITY', '외국인을 만났을 때 간단한 자기소개나 의사표현이 가능한가요?', 3);
INSERT INTO question_options (question_id, option_text, score, option_order) VALUES
((SELECT id FROM onboarding_questions WHERE question_code = 'UPPER_SPEAKING_ABILITY'), '거부감 있음', 0, 1),
((SELECT id FROM onboarding_questions WHERE question_code = 'UPPER_SPEAKING_ABILITY'), '단어로 말함', 2, 2),
((SELECT id FROM onboarding_questions WHERE question_code = 'UPPER_SPEAKING_ABILITY'), '문장으로 말함', 3, 3);

-- 질문 4
INSERT INTO onboarding_questions (age_group, question_code, question_text, question_order) 
VALUES ('upper_elem', 'UPPER_LEARNING_HISTORY', '지난 1년간 꾸준히 영어 원서를 읽어왔나요?', 4);
INSERT INTO question_options (question_id, option_text, score, option_order) VALUES
((SELECT id FROM onboarding_questions WHERE question_code = 'UPPER_LEARNING_HISTORY'), 'No', 0, 1),
((SELECT id FROM onboarding_questions WHERE question_code = 'UPPER_LEARNING_HISTORY'), 'Yes', 3, 2);