-- This script seeds the level_up_thresholds table based on the '레벨업기준표' document.
-- It defines the cumulative activity required to pass each level.

-- Group 1: 영유아기 (0~3세)
INSERT INTO public.level_up_thresholds (level_id, listening_hours_threshold, video_hours_threshold, book_count_threshold, activity_count_threshold, pass_condition)
VALUES
    ((SELECT id FROM levels WHERE code = 'AGE_0'), 500, 0, 300, 30, '영어 동요가 나올 때 엄마와 눈 맞춤 가능'),
    ((SELECT id FROM levels WHERE code = 'AGE_1'), 500, 50, 365, 30, '책을 장난감처럼 여기며 거부감 없이 펼침'),
    ((SELECT id FROM levels WHERE code = 'AGE_2'), 400, 100, 500, 50, '‘Twinkle Twinkle’ 같은 쉬운 동요 리듬을 탐'),
    ((SELECT id FROM levels WHERE code = 'AGE_3'), 300, 150, 600, 50, '그림책의 사물(Apple, Bus)을 짚으며 영어로 발화')
ON CONFLICT (level_id) DO UPDATE SET
    listening_hours_threshold = EXCLUDED.listening_hours_threshold,
    video_hours_threshold = EXCLUDED.video_hours_threshold,
    book_count_threshold = EXCLUDED.book_count_threshold,
    activity_count_threshold = EXCLUDED.activity_count_threshold,
    pass_condition = EXCLUDED.pass_condition;

-- Group 2: 유치기 (4~6세)
INSERT INTO public.level_up_thresholds (level_id, listening_hours_threshold, video_hours_threshold, book_count_threshold, activity_count_threshold, pass_condition)
VALUES
    ((SELECT id FROM levels WHERE code = 'AGE_4'), 300, 200, 800, 80, '페파피그 수준의 영상을 보고 웃거나 상황 이해'),
    ((SELECT id FROM levels WHERE code = 'AGE_5'), 300, 250, 1000, 100, '알파벳 대소문자 100% 구별 & 대표 소릿값 인지'),
    ((SELECT id FROM levels WHERE code = 'AGE_6'), 200, 300, 1000, 120, 'ORT 2~3단계를 오디오 듣고 손가락 짚으며 따라 읽기')
ON CONFLICT (level_id) DO UPDATE SET
    listening_hours_threshold = EXCLUDED.listening_hours_threshold,
    video_hours_threshold = EXCLUDED.video_hours_threshold,
    book_count_threshold = EXCLUDED.book_count_threshold,
    activity_count_threshold = EXCLUDED.activity_count_threshold,
    pass_condition = EXCLUDED.pass_condition;

-- Group 3: 초등 저학년 (초1~3)
INSERT INTO public.level_up_thresholds (level_id, listening_hours_threshold, video_hours_threshold, book_count_threshold, activity_count_threshold, pass_condition)
VALUES
    ((SELECT id FROM levels WHERE code = 'GRADE_1'), 200, 300, 300, 150, 'ORT 5단계 수준 문장을 막힘없이 소리 내어 읽음'),
    ((SELECT id FROM levels WHERE code = 'GRADE_2'), 150, 365, 365, 150, '사이트워드 100개를 1초 안에 보자마자 읽음'),
    ((SELECT id FROM levels WHERE code = 'GRADE_3'), 150, 365, 100, 150, '얼리 챕터북(Nate the Great) 한 권을 혼자 완독')
ON CONFLICT (level_id) DO UPDATE SET
    listening_hours_threshold = EXCLUDED.listening_hours_threshold,
    video_hours_threshold = EXCLUDED.video_hours_threshold,
    book_count_threshold = EXCLUDED.book_count_threshold,
    activity_count_threshold = EXCLUDED.activity_count_threshold,
    pass_condition = EXCLUDED.pass_condition;

-- Group 4: 초등 고학년 (초4~6)
-- Note: For GRADE_6, '해리포터 완독' is interpreted as completing the 7-book series.
INSERT INTO public.level_up_thresholds (level_id, listening_hours_threshold, video_hours_threshold, book_count_threshold, activity_count_threshold, pass_condition)
VALUES
    ((SELECT id FROM levels WHERE code = 'GRADE_4'), 100, 200, 50, 100, '매직트리하우스급 챕터북 묵독 후 줄거리 요약 가능'),
    ((SELECT id FROM levels WHERE code = 'GRADE_5'), 100, 200, 30, 100, '뉴베리 원서(Wonder 등) 한 페이지에 모르는 단어 5개 이하'),
    ((SELECT id FROM levels WHERE code = 'GRADE_6'), 100, 150, 7, 100, '[최종 졸업] 해리포터 원서를 사전 없이 즐겁게 읽음')
ON CONFLICT (level_id) DO UPDATE SET
    listening_hours_threshold = EXCLUDED.listening_hours_threshold,
    video_hours_threshold = EXCLUDED.video_hours_threshold,
    book_count_threshold = EXCLUDED.book_count_threshold,
    activity_count_threshold = EXCLUDED.activity_count_threshold,
    pass_condition = EXCLUDED.pass_condition;
