-- ============================================
-- Migration: 011_auto_create_user_trigger.sql
-- Description: Supabase Auth 사용자 생성 시 users 테이블 자동 생성 트리거
-- ============================================

-- Function: auth.users에 새 사용자가 생성될 때 public.users 테이블에 자동 추가
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING; -- 이미 존재하면 무시 (중복 방지)
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거: auth.users에 새 사용자가 생성될 때 실행
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user IS 'Supabase Auth 사용자 생성 시 users 테이블에 자동 추가';

