-- [1] 다양한 활동 미션 테이블 생성 (DDL)
CREATE TABLE IF NOT EXISTS public.daily_missions (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES public.courses(id) ON DELETE CASCADE,
    level_id INTEGER REFERENCES public.levels(id) ON DELETE CASCADE,
    mission_type VARCHAR(50) NOT NULL, -- 'reading', 'video', 'audio', 'phonics', 'speaking', 'writing'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_duration_minutes INTEGER,
    sequence_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- [2] 미션 수행 기록 테이블 보강 (mission_logs에 mission_id 추가)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='mission_logs' AND COLUMN_NAME='mission_id') THEN
        ALTER TABLE public.mission_logs ADD COLUMN mission_id INTEGER REFERENCES public.daily_missions(id) ON DELETE CASCADE;
    END IF;
END $$;

-- [1] 테이블 구조 개선: 독서 미션 통합을 위한 book_id 컬럼 추가
ALTER TABLE public.daily_missions ADD COLUMN IF NOT EXISTS book_id BIGINT REFERENCES public.books(id) ON DELETE SET NULL;

-- [1] 미션 테이블에 목표 횟수 컬럼 추가
ALTER TABLE public.daily_missions ADD COLUMN IF NOT EXISTS target_count INTEGER DEFAULT 1;

-- [3] 권한 부여
GRANT ALL ON TABLE public.daily_missions TO authenticated, service_role;
GRANT ALL ON SEQUENCE daily_missions_id_seq TO authenticated, service_role;

