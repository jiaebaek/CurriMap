-- ============================================
-- Migration: 006_create_children.sql
-- Description: 자녀 프로필 및 관심사 태그 테이블 생성
-- ============================================

-- 자녀 프로필
CREATE TABLE IF NOT EXISTS children (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nickname VARCHAR(50) NOT NULL,
    birth_months INTEGER NOT NULL CHECK (birth_months >= 0 AND birth_months <= 144),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    current_level_id INTEGER REFERENCES levels(id),
    current_course_id INTEGER REFERENCES courses(id),
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    total_books_read INTEGER NOT NULL DEFAULT 0,
    total_word_count BIGINT NOT NULL DEFAULT 0,
    level_override_reason TEXT,
    level_override_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_children_user ON children(user_id);
CREATE INDEX IF NOT EXISTS idx_children_level ON children(current_level_id);
CREATE INDEX IF NOT EXISTS idx_children_course ON children(current_course_id);
CREATE INDEX IF NOT EXISTS idx_children_birth_months ON children(birth_months);

-- updated_at 자동 갱신 트리거
CREATE TRIGGER update_children_updated_at
    BEFORE UPDATE ON children
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE children ENABLE ROW LEVEL SECURITY;

-- 정책: 부모는 자신의 자녀 데이터만 조회/수정 가능
CREATE POLICY "Parents can view own children" ON children
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Parents can insert own children" ON children
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Parents can update own children" ON children
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Parents can delete own children" ON children
    FOR DELETE USING (auth.uid() = user_id);

COMMENT ON TABLE children IS '자녀 프로필 + 현재 레벨/코스 + 누적 통계';
COMMENT ON COLUMN children.birth_months IS '나이(개월 수)';
COMMENT ON COLUMN children.current_streak IS '현재 연속 학습일 (자녀 단위)';
COMMENT ON COLUMN children.level_override_reason IS '부모가 레벨을 직접 설정한 이유';

-- 자녀 × 관심사 태그 (N:M)
CREATE TABLE IF NOT EXISTS child_interests (
    id SERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    theme_id INTEGER NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    UNIQUE(child_id, theme_id)
);

CREATE INDEX IF NOT EXISTS idx_child_interests_child ON child_interests(child_id);
CREATE INDEX IF NOT EXISTS idx_child_interests_theme ON child_interests(theme_id);

-- RLS 활성화
ALTER TABLE child_interests ENABLE ROW LEVEL SECURITY;

-- 정책: 부모는 자신의 자녀 관심사만 조회/수정 가능
CREATE POLICY "Parents can manage own children interests" ON child_interests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM children
            WHERE children.id = child_interests.child_id
            AND children.user_id = auth.uid()
        )
    );

COMMENT ON TABLE child_interests IS '자녀 × 관심사 태그 (온보딩 취향)';


