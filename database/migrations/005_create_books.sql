-- ============================================
-- Migration: 005_create_books.sql
-- Description: 도서 기본 정보 및 태그 관계 테이블 생성
-- ============================================

-- 도서 기본 정보
CREATE TABLE IF NOT EXISTS books (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    cover_image_url TEXT,
    ar_level NUMERIC(3,1),
    mom_tip TEXT,
    key_words TEXT[],
    purchase_url TEXT,
    word_count INTEGER,
    series_name VARCHAR(255),
    series_order INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_books_ar_level ON books(ar_level);
CREATE INDEX IF NOT EXISTS idx_books_key_words ON books USING GIN(key_words);
CREATE INDEX IF NOT EXISTS idx_books_series ON books(series_name, series_order);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);

-- updated_at 자동 갱신 트리거
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE books IS '도서 기본 정보 + 큐레이션 데이터';
COMMENT ON COLUMN books.ar_level IS 'AR 지수';
COMMENT ON COLUMN books.mom_tip IS '엄마표 팁 (줄바꿈/마크다운 TEXT)';
COMMENT ON COLUMN books.key_words IS '핵심 발화 단어 배열 (TEXT[])';
COMMENT ON COLUMN books.purchase_url IS '구매 링크 URL';

-- 도서 × 주제 태그 (N:M)
CREATE TABLE IF NOT EXISTS book_themes (
    id SERIAL PRIMARY KEY,
    book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    theme_id INTEGER NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    UNIQUE(book_id, theme_id)
);

CREATE INDEX IF NOT EXISTS idx_book_themes_book ON book_themes(book_id);
CREATE INDEX IF NOT EXISTS idx_book_themes_theme ON book_themes(theme_id);

COMMENT ON TABLE book_themes IS '도서 × 주제 태그 관계 (N:M)';

-- 도서 × 분위기 태그 (N:M)
CREATE TABLE IF NOT EXISTS book_moods (
    id SERIAL PRIMARY KEY,
    book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    mood_id INTEGER NOT NULL REFERENCES moods(id) ON DELETE CASCADE,
    UNIQUE(book_id, mood_id)
);

CREATE INDEX IF NOT EXISTS idx_book_moods_book ON book_moods(book_id);
CREATE INDEX IF NOT EXISTS idx_book_moods_mood ON book_moods(mood_id);

COMMENT ON TABLE book_moods IS '도서 × 분위기 태그 관계 (N:M)';


