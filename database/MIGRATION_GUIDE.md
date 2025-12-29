# CurriMap 데이터베이스 마이그레이션 가이드

이 문서는 CurriMap 프로젝트의 Supabase 데이터베이스 마이그레이션을 수행하는 상세 가이드입니다.

## 📋 사전 준비

1. **Supabase 계정 생성**
   - [https://supabase.com](https://supabase.com)에서 계정 생성
   - 새 프로젝트 생성 (PostgreSQL 15+ 권장)

2. **필수 정보 확인**
   - Database URL
   - Database Password
   - API Key (anon, service_role)

3. **도구 준비**
   - Supabase Dashboard 접근 권한
   - 또는 `psql` 클라이언트 (로컬 마이그레이션 시)

## 🚀 마이그레이션 실행 방법

### 방법 1: Supabase Dashboard 사용 (권장)

#### Step 1: SQL Editor 열기
1. Supabase Dashboard 접속
2. 좌측 메뉴에서 **SQL Editor** 클릭
3. **New query** 버튼 클릭

#### Step 2: 마이그레이션 파일 순서대로 실행

**1단계: 기본 테이블 생성**

```sql
-- 001_create_users.sql 실행
-- 002_create_levels.sql 실행
-- 003_create_themes_moods.sql 실행
-- 004_create_courses.sql 실행
-- 005_create_books.sql 실행
-- 006_create_children.sql 실행
-- 007_create_onboarding.sql 실행
-- 008_create_course_books.sql 실행
-- 009_create_mission_logs.sql 실행
-- 010_create_admin_users.sql 실행
```

각 파일의 내용을 복사하여 SQL Editor에 붙여넣고 **Run** 버튼 클릭.

**2단계: PostgreSQL 함수 생성**

```sql
-- functions/calculate_child_level.sql 실행
-- functions/get_next_read_count.sql 실행
-- functions/auto_set_read_count.sql 실행
-- functions/update_child_stats.sql 실행
```

**3단계: 시드 데이터 삽입**

```sql
-- seeds/001_seed_levels.sql 실행
-- seeds/002_seed_themes.sql 실행
-- seeds/003_seed_moods.sql 실행
-- seeds/004_seed_courses.sql 실행
-- seeds/005_seed_onboarding_questions.sql 실행
-- seeds/006_seed_level_thresholds.sql 실행
```

### 방법 2: psql 클라이언트 사용 (고급)

```bash
# 환경 변수 설정
export SUPABASE_DB_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# 마이그레이션 실행
psql $SUPABASE_DB_URL -f migrations/001_create_users.sql
psql $SUPABASE_DB_URL -f migrations/002_create_levels.sql
# ... 나머지 파일들 순서대로 실행
```

## ✅ 마이그레이션 검증

### 1. 테이블 생성 확인

```sql
-- 모든 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

예상 결과:
- admin_users
- book_moods
- book_themes
- books
- child_bookshelf
- child_course_progress
- child_interests
- children
- course_books
- course_levels
- courses
- level_reassessments
- level_thresholds
- levels
- mission_logs
- moods
- onboarding_questions
- onboarding_responses
- question_options
- themes
- users

### 2. 함수 생성 확인

```sql
-- 모든 함수 목록 확인
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

예상 결과:
- auto_set_read_count
- calculate_child_level
- get_next_read_count
- update_child_stats_after_mission
- update_updated_at_column

### 3. 시드 데이터 확인

```sql
-- 레벨 데이터 확인
SELECT code, name FROM levels ORDER BY id;

-- 주제 태그 확인
SELECT code, name FROM themes ORDER BY id;

-- 분위기 태그 확인
SELECT code, name FROM moods ORDER BY id;

-- 온보딩 질문 확인
SELECT age_group, question_code, question_text 
FROM onboarding_questions 
ORDER BY age_group, question_order;
```

### 4. RLS 정책 확인

```sql
-- RLS 활성화된 테이블 확인
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

## 🔄 롤백 방법

마이그레이션을 롤백해야 하는 경우:

### 1. 전체 롤백 (주의: 모든 데이터 삭제)

```sql
-- 모든 테이블 삭제 (외래키 제약조건으로 인해 순서 중요)
DROP TABLE IF EXISTS mission_logs CASCADE;
DROP TABLE IF EXISTS child_bookshelf CASCADE;
DROP TABLE IF EXISTS child_course_progress CASCADE;
DROP TABLE IF EXISTS course_books CASCADE;
DROP TABLE IF EXISTS onboarding_responses CASCADE;
DROP TABLE IF EXISTS level_reassessments CASCADE;
DROP TABLE IF EXISTS child_interests CASCADE;
DROP TABLE IF EXISTS children CASCADE;
DROP TABLE IF EXISTS book_moods CASCADE;
DROP TABLE IF EXISTS book_themes CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS question_options CASCADE;
DROP TABLE IF EXISTS onboarding_questions CASCADE;
DROP TABLE IF EXISTS level_thresholds CASCADE;
DROP TABLE IF EXISTS course_levels CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS levels CASCADE;
DROP TABLE IF EXISTS moods CASCADE;
DROP TABLE IF EXISTS themes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- 함수 삭제
DROP FUNCTION IF EXISTS calculate_child_level(BIGINT);
DROP FUNCTION IF EXISTS get_next_read_count(BIGINT, BIGINT);
DROP FUNCTION IF EXISTS auto_set_read_count();
DROP FUNCTION IF EXISTS update_child_stats_after_mission();
DROP FUNCTION IF EXISTS update_updated_at_column();
```

### 2. 특정 마이그레이션만 롤백

해당 마이그레이션 파일의 `CREATE` 문을 `DROP` 문으로 변경하여 실행.

## 🐛 문제 해결

### 오류: "relation already exists"
- 해당 테이블이 이미 존재하는 경우
- 해결: `DROP TABLE IF EXISTS [table_name] CASCADE;` 실행 후 재실행

### 오류: "foreign key constraint"
- 외래키 참조 순서 문제
- 해결: 부모 테이블이 먼저 생성되어야 함. 마이그레이션 순서 확인

### 오류: "permission denied"
- RLS 정책 또는 권한 문제
- 해결: Supabase Dashboard > Authentication > Policies에서 정책 확인

### 오류: "function does not exist"
- 함수가 아직 생성되지 않음
- 해결: `functions/` 디렉토리의 함수 파일들을 먼저 실행

## 📊 마이그레이션 체크리스트

마이그레이션 완료 후 다음 항목을 확인하세요:

- [ ] 모든 테이블이 생성되었는가?
- [ ] 모든 인덱스가 생성되었는가?
- [ ] 모든 외래키 제약조건이 설정되었는가?
- [ ] 모든 함수가 생성되었는가?
- [ ] 모든 트리거가 생성되었는가?
- [ ] RLS 정책이 올바르게 설정되었는가?
- [ ] 시드 데이터가 올바르게 삽입되었는가?
- [ ] 테스트 쿼리가 정상 작동하는가?

## 🧪 테스트 쿼리

마이그레이션 완료 후 다음 쿼리로 테스트:

```sql
-- 1. 레벨 계산 함수 테스트
SELECT calculate_child_level(1); -- child_id = 1 (존재하는 경우)

-- 2. 회독 횟수 계산 함수 테스트
SELECT get_next_read_count(1, 1); -- child_id = 1, book_id = 1

-- 3. 온보딩 질문 조회 테스트
SELECT oq.question_text, qo.option_text, qo.score
FROM onboarding_questions oq
JOIN question_options qo ON oq.id = qo.question_id
WHERE oq.age_group = 'preschool'
ORDER BY oq.question_order, qo.option_order;

-- 4. 레벨 점수 구간 확인
SELECT lt.age_group, l.code, l.name, lt.min_score, lt.max_score
FROM level_thresholds lt
JOIN levels l ON lt.level_id = l.id
ORDER BY lt.age_group, lt.min_score;
```

## 📝 다음 단계

마이그레이션 완료 후:

1. **백엔드 API 개발**
   - Supabase Client 라이브러리 설정
   - API 엔드포인트 구현

2. **프론트엔드 연동**
   - Supabase Client 초기화
   - 인증 플로우 구현
   - 데이터 조회/수정 API 호출

3. **테스트**
   - 단위 테스트 작성
   - 통합 테스트 수행
   - E2E 테스트 수행

## 🔗 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [ERD 문서](../doc/ERD)


