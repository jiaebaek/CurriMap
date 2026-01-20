-- 1. public 스키마 사용 권한 부여
GRANT USAGE ON SCHEMA public TO authenticated, service_role;

-- 2. 현재 public 스키마에 존재하는 모든 테이블에 대해 권한 부여
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;

-- 3. 현재 public 스키마에 존재하는 모든 시퀀스(ID 자동증가)에 대해 권한 부여
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

-- 4. 앞으로 생성될 테이블들에 대해서도 자동으로 권한이 부여되도록 설정
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated, service_role;

-- 1. 테이블 RLS 활성화 확인 및 정책 추가
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_moods ENABLE ROW LEVEL SECURITY;

-- 2. 누구나 도서 정보를 조회할 수 있도록 허용 (SELECT 정책)
CREATE POLICY "Allow public read access for books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Allow public read access for book_themes" ON public.book_themes FOR SELECT USING (true);
CREATE POLICY "Allow public read access for book_moods" ON public.book_moods FOR SELECT USING (true);

-- 3. 백엔드 역할에 권한 부여
GRANT SELECT ON TABLE public.books TO anon, authenticated, service_role;
GRANT SELECT ON TABLE public.book_themes TO anon, authenticated, service_role;
GRANT SELECT ON TABLE public.book_moods TO anon, authenticated, service_role;