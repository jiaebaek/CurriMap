-- ============================================
-- Migration: 010_create_admin_users.sql
-- Description: 관리자 계정 테이블 생성 (일반 사용자와 완전 분리)
-- ============================================

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- updated_at 자동 갱신 트리거
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화 (필요시 정책 추가)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 정책: 관리자만 조회/수정 가능 (실제 구현 시 admin 권한 체크 로직 추가 필요)
-- 예시: CREATE POLICY "Only admins can access" ON admin_users FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

COMMENT ON TABLE admin_users IS '관리자 계정 (일반 사용자와 완전 분리)';
COMMENT ON COLUMN admin_users.id IS 'Admin Auth ID';


