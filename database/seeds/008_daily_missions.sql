-- [1] 기존 미션 데이터 초기화
TRUNCATE public.daily_missions CASCADE;

-- [2] 14개 레벨별 3대 미션 데이터 삽입

-- 0세 (AGE_0)
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'audio', '🎵 영어 동요 배경음악 흘려듣기', 'Nursery Rhymes를 틀어 소리에 친숙해지게 하세요.', 30, 1 FROM courses c, levels l WHERE c.code = 'YELLOW_BASIC' AND l.code = 'AGE_0';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order, book_id)
SELECT c.id, l.id, 'reading', '📖 보드북 1권 읽어주기', '엄마 목소리로 정서적 교감을 쌓는 독서 시간입니다.', 10, 2, (SELECT id FROM books WHERE title = 'Goodnight Moon' LIMIT 1) FROM courses c, levels l WHERE c.code = 'YELLOW_BASIC' AND l.code = 'AGE_0';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'audio', '🎶 마더구스 리듬 익히기', '리듬감 있는 소리를 반복해서 노출해 주세요.', 10, 3 FROM courses c, levels l WHERE c.code = 'YELLOW_BASIC' AND l.code = 'AGE_0';

-- 1세 (AGE_1)
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'video', '📺 마더구스 영상 10분 시청', '시각과 청각을 동시에 자극하는 짧은 영상입니다.', 10, 1 FROM courses c, levels l WHERE c.code = 'YELLOW_BASIC' AND l.code = 'AGE_1';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order, book_id)
SELECT c.id, l.id, 'reading', '📖 헝겊책/팝업북 2권 노출', '책을 장난감처럼 가지고 놀며 친해지게 하세요.', 15, 2, (SELECT id FROM books WHERE title = 'Dear Zoo' LIMIT 1) FROM courses c, levels l WHERE c.code = 'YELLOW_BASIC' AND l.code = 'AGE_1';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'audio', '🎵 스토리 송 무한 반복', '흥겨운 노래를 통해 문장 리듬을 익힙니다.', 20, 3 FROM courses c, levels l WHERE c.code = 'YELLOW_BASIC' AND l.code = 'AGE_1';

-- 2세 (AGE_2)
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'video', '📺 슈퍼 심플 송 15분 시청', '짧은 단어와 리듬을 인지하는 황금기입니다.', 15, 1 FROM courses c, levels l WHERE c.code = 'YELLOW_BASIC' AND l.code = 'AGE_2';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order, book_id)
SELECT c.id, l.id, 'reading', '📖 한 줄짜리 그림책 3권 읽기', '반복되는 문장을 엄마와 함께 읽어봅니다.', 20, 2, (SELECT id FROM books WHERE title = 'Brown Bear, Brown Bear, What Do You See?' LIMIT 1) FROM courses c, levels l WHERE c.code = 'YELLOW_BASIC' AND l.code = 'AGE_2';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'speaking', '🗣️ 동물 소리 따라하기', '그림책 속 동물의 영어 울음소리를 흉내 내보세요.', 5, 3 FROM courses c, levels l WHERE c.code = 'YELLOW_BASIC' AND l.code = 'AGE_2';

-- 3세 (AGE_3)
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'speaking', '🗣️ 생활 영어 단어 3개 말하기', '사물 이름을 영어로 말해보며 어휘를 확장합니다.', 5, 1 FROM courses c, levels l WHERE c.code = 'YELLOW_BASIC' AND l.code = 'AGE_3';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order, book_id)
SELECT c.id, l.id, 'reading', '📖 그림책 5권 읽기', '소리와 사물을 연결하며 그림 중심 독서를 합니다.', 25, 2, (SELECT id FROM books WHERE title = 'The Very Hungry Caterpillar' LIMIT 1) FROM courses c, levels l WHERE c.code = 'YELLOW_BASIC' AND l.code = 'AGE_3';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'video', '📺 베이직 에듀 애니메이션', '간단한 일상 영어가 담긴 영상을 시청합니다.', 20, 3 FROM courses c, levels l WHERE c.code = 'YELLOW_BASIC' AND l.code = 'AGE_3';

-- 4세 (AGE_4)
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'video', '📺 페파피그 영상 30분 시청', '문장 소리에 익숙해지도록 자막 없이 봅니다.', 30, 1 FROM courses c, levels l WHERE c.code = 'GREEN_PHONICS' AND l.code = 'AGE_4';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order, book_id)
SELECT c.id, l.id, 'reading', '📖 그림책 3권 반복 읽기', '아는 이야기를 반복해서 읽으며 문장력을 키웁니다.', 25, 2, (SELECT id FROM books WHERE title = 'Don''t Let the Pigeon Drive the Bus!' LIMIT 1) FROM courses c, levels l WHERE c.code = 'GREEN_PHONICS' AND l.code = 'AGE_4';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'audio', '🎧 책 오디오 20분 흘려듣기', '그림책 음원을 배경음악으로 활용하세요.', 20, 3 FROM courses c, levels l WHERE c.code = 'GREEN_PHONICS' AND l.code = 'AGE_4';

-- 5세 (AGE_5)
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'phonics', '🎵 파닉스 동요 1곡 부르기', '알파벳 소리값을 노래로 재미있게 익힙니다.', 10, 1 FROM courses c, levels l WHERE c.code = 'GREEN_PHONICS' AND l.code = 'AGE_5';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'phonics', '📇 사이트워드 카드 1장 노출', '눈으로 바로 읽는 빈출 단어를 연습합니다.', 5, 2 FROM courses c, levels l WHERE c.code = 'GREEN_PHONICS' AND l.code = 'AGE_5';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order, book_id)
SELECT c.id, l.id, 'reading', '📖 리더스북(ORT 1-2) 1권 읽기', '파닉스 규칙을 실제 책 읽기에 적용해봅니다.', 20, 3, (SELECT id FROM books WHERE title = 'The Library (ORT 2)' LIMIT 1) FROM courses c, levels l WHERE c.code = 'GREEN_PHONICS' AND l.code = 'AGE_5';

-- 6세 (AGE_6)
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'phonics', '📝 파닉스 교재 2쪽 풀기', '글자와 소리의 규칙을 체계적으로 다집니다.', 20, 1 FROM courses c, levels l WHERE c.code = 'GREEN_PHONICS' AND l.code = 'AGE_6';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order, book_id)
SELECT c.id, l.id, 'reading', '📖 음원 듣고 따라 읽기(Shadowing)', '정확한 발음과 억양을 따라 하며 읽어보세요.', 15, 2, (SELECT id FROM books WHERE title = 'The Egg Hunt (ORT 3)' LIMIT 1) FROM courses c, levels l WHERE c.code = 'GREEN_PHONICS' AND l.code = 'AGE_6';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'video', '📺 스토리텔링 영상 40분 시청', '이야기 중심의 영어 영상을 몰입해서 봅니다.', 40, 3 FROM courses c, levels l WHERE c.code = 'GREEN_PHONICS' AND l.code = 'AGE_6';

-- 초1 (GRADE_1)
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order, book_id)
SELECT c.id, l.id, 'reading', '📖 리더스북(ORT 4-5) 2권 읽기', '짧은 문장을 스스로 읽어보는 단계입니다.', 30, 1, (SELECT id FROM books WHERE title = 'Today I Will Fly!' LIMIT 1) FROM courses c, levels l WHERE c.code = 'BLUE_READER' AND l.code = 'GRADE_1';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'writing', '✍️ 주요 사이트워드 5개 쓰기', '읽은 단어를 직접 써보며 스펠링을 익힙니다.', 10, 2 FROM courses c, levels l WHERE c.code = 'BLUE_READER' AND l.code = 'GRADE_1';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'speaking', '🗣️ 영상 문장 쉐도잉 5분', '좋아하는 영상의 문장을 실감 나게 따라 합니다.', 5, 3 FROM courses c, levels l WHERE c.code = 'BLUE_READER' AND l.code = 'GRADE_1';

-- 초2 (GRADE_2)
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order, book_id)
SELECT c.id, l.id, 'reading', '📖 리더스북(ORT 6-7) 1권 정독', '유창성을 기르고 모르는 단어를 체크합니다.', 30, 1, (SELECT id FROM books WHERE title = 'Frog and Toad Are Friends' LIMIT 1) FROM courses c, levels l WHERE c.code = 'BLUE_READER' AND l.code = 'GRADE_2';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'phonics', '📇 사이트워드 100개 복습', '빈출 단어를 막힘없이 읽는지 확인합니다.', 20, 2 FROM courses c, levels l WHERE c.code = 'BLUE_READER' AND l.code = 'GRADE_2';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'video', '📺 영어 애니메이션 1시간 시청', '무자막 시청을 통해 듣기 실력을 극대화합니다.', 60, 3 FROM courses c, levels l WHERE c.code = 'BLUE_READER' AND l.code = 'GRADE_2';

-- 초3 (GRADE_3)
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order, book_id)
SELECT c.id, l.id, 'reading', '📖 얼리 챕터북 1개 챕터 읽기', '그림책에서 글자 위주 책으로 전환하는 훈련입니다.', 25, 1, (SELECT id FROM books WHERE title = 'Nate the Great' LIMIT 1) FROM courses c, levels l WHERE c.code = 'BLUE_READER' AND l.code = 'GRADE_3';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'reading', '🔍 모르는 단어 문맥 유추하기', '사전 없이 앞뒤 문장으로 뜻을 짐작해 보세요.', 10, 2 FROM courses c, levels l WHERE c.code = 'BLUE_READER' AND l.code = 'GRADE_3';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'audio', '🎧 집중듣기 20분', '오디오를 들으며 눈으로 글자를 정확히 따라갑니다.', 20, 3 FROM courses c, levels l WHERE c.code = 'BLUE_READER' AND l.code = 'GRADE_3';

-- 초4 (GRADE_4)
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order, book_id)
SELECT c.id, l.id, 'reading', '📖 챕터북 2개 챕터 읽기', '100페이지 내외의 책을 완독하는 습관을 들입니다.', 40, 1, (SELECT id FROM books WHERE title = 'Dinosaurs Before Dark' LIMIT 1) FROM courses c, levels l WHERE c.code = 'PURPLE_CHAPTER' AND l.code = 'GRADE_4';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'writing', '✍️ 영어 일기 3문장 쓰기', '하루의 일상을 간단한 영어로 기록합니다.', 15, 2 FROM courses c, levels l WHERE c.code = 'PURPLE_CHAPTER' AND l.code = 'GRADE_4';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'speaking', '💬 주 2회 화상영어 참여', '원어민과 직접 소통하며 회화 자신감을 키웁니다.', 25, 3 FROM courses c, levels l WHERE c.code = 'PURPLE_CHAPTER' AND l.code = 'GRADE_4';

-- 초5 (GRADE_5)
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order, book_id)
SELECT c.id, l.id, 'reading', '📖 뉴베리 수상작 5쪽 읽기', '수준 높은 문학 작품을 정독하며 심화 학습합니다.', 30, 1, (SELECT id FROM books WHERE title = 'Wonder' LIMIT 1) FROM courses c, levels l WHERE c.code = 'PURPLE_CHAPTER' AND l.code = 'GRADE_5';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'speaking', '🗣️ TED Ed 영상 시청 및 요약', '핵심 내용을 요약하여 말해보는 훈련입니다.', 15, 2 FROM courses c, levels l WHERE c.code = 'PURPLE_CHAPTER' AND l.code = 'GRADE_5';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'speaking', '💬 화상영어 20분 집중', '자유로운 주제로 논리적인 대화를 연습합니다.', 20, 3 FROM courses c, levels l WHERE c.code = 'PURPLE_CHAPTER' AND l.code = 'GRADE_5';

-- 초6 (GRADE_6)
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order, book_id)
SELECT c.id, l.id, 'reading', '📖 해리포터 1개 챕터 읽기', '원서 완독의 기쁨을 느끼는 최종 목표 단계입니다.', 50, 1, (SELECT id FROM books WHERE title LIKE 'Harry Potter%' LIMIT 1) FROM courses c, levels l WHERE c.code = 'PURPLE_CHAPTER' AND l.code = 'GRADE_6';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'video', '📺 해외 뉴스(CNN 10) 시청', '시사 상식을 넓히고 고급 어휘를 접합니다.', 10, 2 FROM courses c, levels l WHERE c.code = 'PURPLE_CHAPTER' AND l.code = 'GRADE_6';
INSERT INTO daily_missions (course_id, level_id, mission_type, title, description, target_duration_minutes, sequence_order)
SELECT c.id, l.id, 'speaking', '💬 자유 주제 10분 영어 수다', '막힘없이 프리토킹을 즐기는 최종 아웃풋 미션입니다.', 10, 3 FROM courses c, levels l WHERE c.code = 'PURPLE_CHAPTER' AND l.code = 'GRADE_6';