-- ============================================
-- Migration: 007_create_onboarding.sql
-- Description: 연령별 온보딩 질문 시스템 테이블 생성
-- ============================================

-- 온보딩 질문 정의
CREATE TABLE IF NOT EXISTS onboarding_questions (
    id SERIAL PRIMARY KEY,
    age_group VARCHAR(20) NOT NULL CHECK (age_group IN ('infant', 'preschool', 'lower_elem', 'upper_elem')),
    question_code VARCHAR(50) UNIQUE NOT NULL,
    question_text TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_onboarding_questions_age_group ON onboarding_questions(age_group, question_order);
CREATE INDEX IF NOT EXISTS idx_onboarding_questions_code ON onboarding_questions(question_code);

COMMENT ON TABLE onboarding_questions IS '연령별 온보딩 질문 정의';
COMMENT ON COLUMN onboarding_questions.age_group IS '연령 그룹: infant(0~3세), preschool(4~7세), lower_elem(초1~3), upper_elem(초4~6)';
COMMENT ON COLUMN onboarding_questions.question_code IS '질문 코드 (예: INFANT_AUDIO_EXPOSURE)';

-- 질문 선택지 + 점수
CREATE TABLE IF NOT EXISTS question_options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES onboarding_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 3),
    option_order INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_question_options_question ON question_options(question_id);

COMMENT ON TABLE question_options IS '질문 선택지 + 점수 (0~3점 스케일)';

-- 자녀의 진단 응답 기록
CREATE TABLE IF NOT EXISTS onboarding_responses (
    id BIGSERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES onboarding_questions(id) ON DELETE CASCADE,
    option_id INTEGER NOT NULL REFERENCES question_options(id) ON DELETE CASCADE,
    responded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(child_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_onboarding_responses_child ON onboarding_responses(child_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_question ON onboarding_responses(question_id);

-- RLS 활성화
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- 정책: 부모는 자신의 자녀 응답만 조회/수정 가능
CREATE POLICY "Parents can manage own children responses" ON onboarding_responses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM children
            WHERE children.id = onboarding_responses.child_id
            AND children.user_id = auth.uid()
        )
    );

COMMENT ON TABLE onboarding_responses IS '자녀의 진단 응답 기록';

-- 연령 그룹별 점수 구간 → 레벨 매핑
CREATE TABLE IF NOT EXISTS level_thresholds (
    id SERIAL PRIMARY KEY,
    age_group VARCHAR(20) NOT NULL CHECK (age_group IN ('infant', 'preschool', 'lower_elem', 'upper_elem')),
    level_id INTEGER NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
    min_score INTEGER NOT NULL,
    max_score INTEGER NOT NULL CHECK (max_score >= min_score),
    UNIQUE(age_group, level_id)
);

CREATE INDEX IF NOT EXISTS idx_level_thresholds_age_group ON level_thresholds(age_group);
CREATE INDEX IF NOT EXISTS idx_level_thresholds_level ON level_thresholds(level_id);

COMMENT ON TABLE level_thresholds IS '연령 그룹별 점수 구간 → 레벨 매핑';
COMMENT ON COLUMN level_thresholds.min_score IS '최소 점수';
COMMENT ON COLUMN level_thresholds.max_score IS '최대 점수';

-- 재진단 기록 (옵션)
CREATE TABLE IF NOT EXISTS level_reassessments (
    id SERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    old_level_id INTEGER REFERENCES levels(id),
    new_level_id INTEGER REFERENCES levels(id),
    total_score INTEGER,
    reassessed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_level_reassessments_child ON level_reassessments(child_id, reassessed_at);

-- RLS 활성화
ALTER TABLE level_reassessments ENABLE ROW LEVEL SECURITY;

-- 정책: 부모는 자신의 자녀 재진단 기록만 조회 가능
CREATE POLICY "Parents can view own children reassessments" ON level_reassessments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM children
            WHERE children.id = level_reassessments.child_id
            AND children.user_id = auth.uid()
        )
    );

COMMENT ON TABLE level_reassessments IS '재진단 기록 (옵션)';


