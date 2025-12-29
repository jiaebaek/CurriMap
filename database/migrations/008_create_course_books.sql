-- ============================================
-- Migration: 008_create_course_books.sql
-- Description: 코스 내 도서 리스트 및 자녀 코스 진행 상태 테이블 생성
-- ============================================

-- 코스 내 도서 리스트 + 순서
CREATE TABLE IF NOT EXISTS course_books (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    level_id INTEGER REFERENCES levels(id),
    sequence_order INTEGER NOT NULL,
    UNIQUE(course_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_course_books_course ON course_books(course_id);
CREATE INDEX IF NOT EXISTS idx_course_books_book ON course_books(book_id);
CREATE INDEX IF NOT EXISTS idx_course_books_level ON course_books(level_id);
CREATE INDEX IF NOT EXISTS idx_course_books_sequence ON course_books(course_id, level_id, sequence_order);

COMMENT ON TABLE course_books IS '코스에 포함된 도서 리스트 + 순서 (로드맵 시각화)';
COMMENT ON COLUMN course_books.sequence_order IS '코스 내 표시 순서';

-- 자녀 × 코스 진행 상태
CREATE TABLE IF NOT EXISTS child_course_progress (
    id SERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    current_position INTEGER,
    progress_percent NUMERIC(5,2) CHECK (progress_percent >= 0 AND progress_percent <= 100),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(child_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_child_course_progress_child ON child_course_progress(child_id);
CREATE INDEX IF NOT EXISTS idx_child_course_progress_course ON child_course_progress(course_id);

-- RLS 활성화
ALTER TABLE child_course_progress ENABLE ROW LEVEL SECURITY;

-- 정책: 부모는 자신의 자녀 진행 상태만 조회/수정 가능
CREATE POLICY "Parents can manage own children progress" ON child_course_progress
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM children
            WHERE children.id = child_course_progress.child_id
            AND children.user_id = auth.uid()
        )
    );

COMMENT ON TABLE child_course_progress IS '자녀 × 코스 진행 상태 (로드맵 시각화에 사용)';
COMMENT ON COLUMN child_course_progress.current_position IS '현재 진행 중인 sequence_order';
COMMENT ON COLUMN child_course_progress.progress_percent IS '진행률 (%)';


