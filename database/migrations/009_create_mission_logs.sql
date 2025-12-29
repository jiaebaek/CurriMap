-- ============================================
-- Migration: 009_create_mission_logs.sql
-- Description: 미션/자유 기록 이벤트 로그 및 서재 테이블 생성
-- ============================================

-- 미션/자유 기록 이벤트 로그
CREATE TABLE IF NOT EXISTS mission_logs (
    id BIGSERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id BIGINT REFERENCES books(id) ON DELETE SET NULL,
    course_id INTEGER REFERENCES courses(id),
    activity_type VARCHAR(30) NOT NULL CHECK (activity_type IN ('reading', 'video', 'focused_listening', 'background_listening')),
    read_count INTEGER NOT NULL DEFAULT 1,
    is_manual_log BOOLEAN NOT NULL DEFAULT FALSE,
    reaction VARCHAR(10) CHECK (reaction IN ('love', 'soso', 'hate')),
    checklist JSONB,
    logged_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_mission_logs_child ON mission_logs(child_id, logged_at);
CREATE INDEX IF NOT EXISTS idx_mission_logs_book ON mission_logs(book_id);
CREATE INDEX IF NOT EXISTS idx_mission_logs_course ON mission_logs(course_id);
CREATE INDEX IF NOT EXISTS idx_mission_logs_reaction ON mission_logs(reaction);
CREATE INDEX IF NOT EXISTS idx_mission_logs_child_book ON mission_logs(child_id, book_id);
CREATE INDEX IF NOT EXISTS idx_mission_logs_activity_type ON mission_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_mission_logs_logged_at ON mission_logs(logged_at DESC);

-- RLS 활성화
ALTER TABLE mission_logs ENABLE ROW LEVEL SECURITY;

-- 정책: 부모는 자신의 자녀 미션 로그만 조회/수정 가능
CREATE POLICY "Parents can manage own children mission logs" ON mission_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM children
            WHERE children.id = mission_logs.child_id
            AND children.user_id = auth.uid()
        )
    );

COMMENT ON TABLE mission_logs IS '미션/자유 기록 이벤트 로그 (읽을 때마다 1 row)';
COMMENT ON COLUMN mission_logs.activity_type IS '활동 유형: reading, video, focused_listening, background_listening';
COMMENT ON COLUMN mission_logs.read_count IS '해당 책을 몇 회독했는지 (같은 child_id + book_id 조합에서의 순번)';
COMMENT ON COLUMN mission_logs.book_id IS 'reading 활동일 때 필수, 그 외는 NULL 가능';

-- 내 서재 (Read / Wish / Reading)
CREATE TABLE IF NOT EXISTS child_bookshelf (
    id SERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('read', 'wish', 'reading')),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(child_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_child_bookshelf_child ON child_bookshelf(child_id);
CREATE INDEX IF NOT EXISTS idx_child_bookshelf_book ON child_bookshelf(book_id);
CREATE INDEX IF NOT EXISTS idx_child_bookshelf_status ON child_bookshelf(child_id, status);

-- updated_at 자동 갱신 트리거
CREATE TRIGGER update_child_bookshelf_updated_at
    BEFORE UPDATE ON child_bookshelf
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE child_bookshelf ENABLE ROW LEVEL SECURITY;

-- 정책: 부모는 자신의 자녀 서재만 조회/수정 가능
CREATE POLICY "Parents can manage own children bookshelf" ON child_bookshelf
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM children
            WHERE children.id = child_bookshelf.child_id
            AND children.user_id = auth.uid()
        )
    );

COMMENT ON TABLE child_bookshelf IS '자녀 × 도서 상태 (Read / Wish / Reading)';


