# CurriMap Database Schema

CurriMap 프로젝트의 Supabase (PostgreSQL) 데이터베이스 스키마 및 마이그레이션 파일입니다.

## 📁 디렉토리 구조

```
database/
├── migrations/          # 테이블 생성 마이그레이션 파일
│   ├── 001_create_users.sql
│   ├── 002_create_levels.sql
│   ├── 003_create_themes_moods.sql
│   ├── 004_create_courses.sql
│   ├── 005_create_books.sql
│   ├── 006_create_children.sql
│   ├── 007_create_onboarding.sql
│   ├── 008_create_course_books.sql
│   ├── 009_create_mission_logs.sql
│   └── 010_create_admin_users.sql
├── functions/          # PostgreSQL 함수 및 트리거
│   ├── calculate_child_level.sql
│   ├── get_next_read_count.sql
│   ├── update_child_stats.sql
│   └── auto_set_read_count.sql
├── seeds/              # 시드 데이터
│   ├── 001_seed_levels.sql
│   ├── 002_seed_themes.sql
│   ├── 003_seed_moods.sql
│   ├── 004_seed_courses.sql
│   ├── 005_seed_onboarding_questions.sql
│   └── 006_seed_level_thresholds.sql
└── README.md          # 이 파일
```

## 🚀 초기 설정 방법

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 로그인
2. 새 프로젝트 생성
3. 프로젝트 설정에서 Database URL 및 API Key 확인

### 2. 마이그레이션 실행 순서

**중요**: 파일 번호 순서대로 실행해야 합니다.

#### Step 1: 기본 테이블 생성
```bash
# Supabase Dashboard > SQL Editor에서 순서대로 실행
1. 001_create_users.sql
2. 002_create_levels.sql
3. 003_create_themes_moods.sql
4. 004_create_courses.sql
5. 005_create_books.sql
6. 006_create_children.sql
7. 007_create_onboarding.sql
8. 008_create_course_books.sql
9. 009_create_mission_logs.sql
10. 010_create_admin_users.sql
```

#### Step 2: PostgreSQL 함수 생성
```bash
# Supabase Dashboard > SQL Editor에서 순서대로 실행
1. functions/calculate_child_level.sql
2. functions/get_next_read_count.sql
3. functions/auto_set_read_count.sql
4. functions/update_child_stats.sql
```

#### Step 3: 시드 데이터 삽입
```bash
# Supabase Dashboard > SQL Editor에서 순서대로 실행
1. seeds/001_seed_levels.sql
2. seeds/002_seed_themes.sql
3. seeds/003_seed_moods.sql
4. seeds/004_seed_courses.sql
5. seeds/005_seed_onboarding_questions.sql
6. seeds/006_seed_level_thresholds.sql
```

### 3. RLS (Row Level Security) 확인

모든 사용자 데이터 테이블에는 RLS가 활성화되어 있습니다:
- `users`
- `children`
- `child_interests`
- `onboarding_responses`
- `level_reassessments`
- `child_course_progress`
- `mission_logs`
- `child_bookshelf`

**주의**: Admin 계정(`admin_users`)의 RLS 정책은 실제 운영 환경에 맞게 수정해야 합니다.

## 📊 주요 테이블 설명

### 핵심 엔티티

- **users**: 부모 계정 메타 (Supabase Auth와 1:1)
- **children**: 자녀 프로필 + 현재 레벨/코스 + 누적 통계
- **books**: 도서 기본 정보 + 큐레이션 데이터 (Mom's Tip, Key Words 등)
- **mission_logs**: 미션/자유 기록 이벤트 로그 (읽을 때마다 1 row)

### 온보딩 시스템

- **onboarding_questions**: 연령별 온보딩 질문 정의
- **question_options**: 질문 선택지 + 점수
- **onboarding_responses**: 자녀의 진단 응답 기록
- **level_thresholds**: 연령 그룹별 점수 구간 → 레벨 매핑

### 로드맵 시스템

- **courses**: 코스 정의 (옐로우 코스, 그린 코스 등)
- **course_levels**: 코스 × 레벨별 목표/설정
- **course_books**: 코스에 포함된 도서 리스트 + 순서
- **child_course_progress**: 자녀 × 코스 진행 상태

### 태그 시스템

- **themes**: 주제 태그 마스터 (공룡, 자동차 등)
- **moods**: 분위기 태그 마스터 (웃긴, 감동 등)
- **book_themes**: 도서 × 주제 태그 (N:M)
- **book_moods**: 도서 × 분위기 태그 (N:M)
- **child_interests**: 자녀 × 관심사 태그

## 🔧 주요 함수

### `calculate_child_level(p_child_id BIGINT)`
자녀의 온보딩 응답 점수를 기반으로 레벨을 자동 계산합니다.

**사용 예시:**
```sql
SELECT calculate_child_level(123);
```

### `get_next_read_count(p_child_id BIGINT, p_book_id BIGINT)`
같은 child_id + book_id 조합에서의 다음 회독 횟수를 계산합니다.

**사용 예시:**
```sql
SELECT get_next_read_count(123, 456);
```

### 자동 트리거

- **trigger_auto_set_read_count**: `mission_logs` INSERT 시 `read_count` 자동 설정
- **trigger_update_child_stats**: `mission_logs` INSERT 후 자녀 통계 자동 업데이트

## 🔐 보안 고려사항

1. **RLS 정책**: 모든 사용자 데이터는 RLS로 보호됩니다. 사용자는 자신의 데이터만 조회/수정 가능합니다.
2. **Admin 권한**: `admin_users` 테이블의 RLS 정책은 실제 운영 환경에 맞게 수정해야 합니다.
3. **외래키 제약조건**: CASCADE 옵션으로 데이터 무결성을 보장합니다.

## 📝 데이터 무결성

- 모든 외래키 제약조건 설정 완료
- CHECK 제약조건으로 데이터 유효성 검증
- UNIQUE 제약조건으로 중복 방지
- NOT NULL 제약조건으로 필수 데이터 보장

## 🧪 테스트 데이터

시드 데이터에는 다음이 포함됩니다:
- 레벨 정의 (AGE_0 ~ GRADE_6)
- 주제 태그 20개
- 분위기 태그 12개
- 코스 4개 (옐로우, 그린, 블루, 퍼플)
- 연령별 온보딩 질문 및 선택지
- 레벨 점수 구간 매핑

## 📚 추가 문서

- 상세 ERD: `doc/ERD`
- 기능 명세서: `doc/상세기능 명세서 및 로직 정의서`
- PRD: `doc/제품 요구사항 정의서(PRD)`

## ⚠️ 주의사항

1. **마이그레이션 순서**: 파일 번호 순서대로 실행해야 합니다.
2. **시드 데이터**: 시드 데이터는 개발 환경에서만 사용하세요.
3. **RLS 정책**: 운영 환경에서는 Admin 권한 정책을 반드시 수정하세요.
4. **백업**: 프로덕션 배포 전 데이터베이스 백업을 수행하세요.

## 🆘 문제 해결

### 마이그레이션 오류 시
1. Supabase Dashboard > Database > Logs에서 오류 확인
2. 해당 마이그레이션 파일의 SQL 문법 확인
3. 외래키 참조 순서 확인 (부모 테이블이 먼저 생성되어야 함)

### RLS 정책 오류 시
1. Supabase Dashboard > Authentication > Policies에서 정책 확인
2. `auth.uid()` 함수가 올바르게 작동하는지 확인
3. 테스트 사용자로 직접 쿼리 실행하여 권한 확인

## 📞 문의

데이터베이스 스키마 관련 문의사항이 있으시면 프로젝트 관리자에게 연락하세요.


