-- 1. 대표 도서 데이터 삽입 (books)
INSERT INTO books (title, author, ar_level, mom_tip, key_words, series_name, series_order) VALUES
-- 영유아기 (Yellow Basic)
('Goodnight Moon', 'Margaret Wise Brown', 1.8, '자기 전에 읽어주며 소품들을 하나씩 가리켜보세요.', ARRAY['moon', 'balloon', 'light'], 'Classic Board Books', 1),
('Brown Bear, Brown Bear, What Do You See?', 'Bill Martin Jr.', 1.6, '동물 이름과 색깔 표현을 리듬감 있게 읽어주세요.', ARRAY['bear', 'duck', 'horse'], 'Eric Carle Collection', 1),
('The Very Hungry Caterpillar', 'Eric Carle', 2.9, '요일과 음식 이름을 익히기에 아주 좋습니다.', ARRAY['caterpillar', 'apple', 'butterfly'], 'Eric Carle Collection', 2),
('Dear Zoo', 'Rod Campbell', 1.3, '들춰보기(Flap)를 통해 동물의 특징을 말해보세요.', ARRAY['zoo', 'elephant', 'lion'], 'Lift-the-flap', 1),

-- 유치기 (Green Phonics)
('The Haircut (ORT 1+)', 'Roderick Hunt', 0.8, '파닉스 1단계 수준입니다. 그림 위주로 읽어주세요.', ARRAY['hair', 'cut', 'dad'], 'Oxford Reading Tree', 1),
('The Library (ORT 2)', 'Roderick Hunt', 1.1, '도서관 예절과 관련된 쉬운 문장으로 구성되어 있습니다.', ARRAY['library', 'book', 'quiet'], 'Oxford Reading Tree', 2),
('Don''t Let the Pigeon Drive the Bus!', 'Mo Willems', 0.9, '비둘기의 대사를 실감나게 연기하며 아이의 대답을 유도하세요.', ARRAY['pigeon', 'bus', 'drive'], 'Pigeon Series', 1),
('The Egg Hunt (ORT 3)', 'Roderick Hunt', 1.4, '과거형 문장들이 조금씩 등장하기 시작합니다.', ARRAY['egg', 'hunt', 'find'], 'Oxford Reading Tree', 3),

-- 초등 저학년 (Blue Reader)
('Today I Will Fly!', 'Mo Willems', 0.5, '대화문으로만 구성되어 있어 쉐도잉하기에 최고입니다.', ARRAY['fly', 'pig', 'elephant'], 'Elephant & Piggie', 1),
('Frog and Toad Are Friends', 'Arnold Lobel', 2.9, '잔잔한 우정 이야기로 읽기 독립을 시작해보세요.', ARRAY['frog', 'toad', 'friend'], 'I Can Read Level 2', 1),
('Mercy Watson to the Rescue', 'Kate DiCamillo', 2.7, '글밥이 늘어나는 얼리 챕터북의 입문서입니다.', ARRAY['pig', 'toast', 'butter'], 'Mercy Watson', 1),
('Nate the Great', 'Marjorie Weinman Sharmat', 2.0, '탐정 추리물로 아이의 흥미를 자극해보세요.', ARRAY['pancake', 'detective', 'case'], 'Nate the Great', 1),
('Dinosaurs Before Dark', 'Mary Pope Osborne', 2.6, '매직트리하우스의 시작입니다. 모험을 떠나볼까요?', ARRAY['treehouse', 'dinosaur', 'magic'], 'Magic Tree House', 1),

-- 초등 고학년 (Purple Chapter)
('The Bad Guys', 'Aaron Blabey', 2.4, '만화 형식으로 되어 있어 챕터북 거부감을 줄여줍니다.', ARRAY['wolf', 'snake', 'shark'], 'The Bad Guys', 1),
('Frindle', 'Andrew Clements', 4.8, '새로운 단어를 만드는 아이의 기발한 상상력 이야기입니다.', ARRAY['pen', 'word', 'school'], NULL, NULL),
('Wonder', 'R.J. Palacio', 4.8, '장애를 극복하는 감동적인 이야기로 어휘 수준이 높습니다.', ARRAY['august', 'face', 'kindness'], NULL, NULL),
('Holes', 'Louis Sachar', 4.6, '탄탄한 구성을 가진 명작으로 문맥 유추 훈련에 좋습니다.', ARRAY['camp', 'hole', 'dig'], NULL, NULL),
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 5.5, '드디어 최종 목표! 오디오북과 함께 정독하세요.', ARRAY['wizard', 'wand', 'hogwarts'], 'Harry Potter', 1)
ON CONFLICT (isbn) DO NOTHING;

-- 2. 도서 주제 연결 (book_themes)
INSERT INTO book_themes (book_id, theme_id)
SELECT b.id, t.id FROM books b, themes t 
WHERE (b.title = 'Goodnight Moon' AND t.code = 'FAMILY')
   OR (b.title = 'Brown Bear, Brown Bear, What Do You See?' AND t.code = 'ANIMAL')
   OR (b.title = 'Dinosaurs Before Dark' AND t.code = 'DINOSAUR')
   OR (b.title = 'Harry Potter and the Sorcerer''s Stone' AND t.code = 'FANTASY')
ON CONFLICT DO NOTHING;

-- 3. 코스 및 레벨별 도서 배치 (course_books)
-- Yellow Basic (0-3세)
INSERT INTO course_books (course_id, book_id, level_id, sequence_order)
SELECT c.id, b.id, l.id, 1 FROM courses c, books b, levels l 
WHERE c.code = 'YELLOW_BASIC' AND b.title = 'Goodnight Moon' AND l.code = 'AGE_0'
ON CONFLICT DO NOTHING;

INSERT INTO course_books (course_id, book_id, level_id, sequence_order)
SELECT c.id, b.id, l.id, 1 FROM courses c, books b, levels l 
WHERE c.code = 'YELLOW_BASIC' AND b.title = 'Brown Bear, Brown Bear, What Do You See?' AND l.code = 'AGE_1'
ON CONFLICT DO NOTHING;

-- Green Phonics (4-6세)
INSERT INTO course_books (course_id, book_id, level_id, sequence_order)
SELECT c.id, b.id, l.id, 1 FROM courses c, books b, levels l 
WHERE c.code = 'GREEN_PHONICS' AND b.title = 'The Haircut (ORT 1+)' AND l.code = 'AGE_5'
ON CONFLICT DO NOTHING;

INSERT INTO course_books (course_id, book_id, level_id, sequence_order)
SELECT c.id, b.id, l.id, 2 FROM courses c, books b, levels l 
WHERE c.code = 'GREEN_PHONICS' AND b.title = 'The Library (ORT 2)' AND l.code = 'AGE_5'
ON CONFLICT DO NOTHING;

-- Blue Reader (초등 저학년)
INSERT INTO course_books (course_id, book_id, level_id, sequence_order)
SELECT c.id, b.id, l.id, 1 FROM courses c, books b, levels l 
WHERE c.code = 'BLUE_READER' AND b.title = 'Today I Will Fly!' AND l.code = 'GRADE_1'
ON CONFLICT DO NOTHING;

INSERT INTO course_books (course_id, book_id, level_id, sequence_order)
SELECT c.id, b.id, l.id, 1 FROM courses c, books b, levels l 
WHERE c.code = 'BLUE_READER' AND b.title = 'Dinosaurs Before Dark' AND l.code = 'GRADE_3'
ON CONFLICT DO NOTHING;

-- Purple Chapter (초등 고학년)
INSERT INTO course_books (course_id, book_id, level_id, sequence_order)
SELECT c.id, b.id, l.id, 1 FROM courses c, books b, levels l 
WHERE c.code = 'PURPLE_CHAPTER' AND b.title = 'Harry Potter and the Sorcerer''s Stone' AND l.code = 'GRADE_6'
ON CONFLICT DO NOTHING; 