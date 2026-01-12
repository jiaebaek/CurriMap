# Supabase에서 사용자 확인 방법

## "Invalid login credentials" 에러 해결을 위한 사용자 확인

### 1. Supabase 대시보드 접속

1. [Supabase 대시보드](https://app.supabase.com) 접속
2. 프로젝트 선택

### 2. 사용자 목록 확인

**경로:** `Authentication` → `Users`

여기서 확인할 수 있는 정보:
- ✅ 사용자가 생성되었는지 확인
- ✅ 이메일 주소 확인
- ✅ 이메일 확인 상태 (`email_confirmed_at` 필드)
- ✅ 마지막 로그인 시간

### 3. 문제 진단

#### 시나리오 A: 사용자가 목록에 없음
**원인:** 회원가입이 완료되지 않았거나 실패함

**해결 방법:**
1. 앱에서 회원가입을 다시 시도
2. 회원가입 성공 메시지 확인
3. Supabase 대시보드에서 사용자 생성 확인

#### 시나리오 B: 사용자가 있지만 `email_confirmed_at`이 NULL
**원인:** 이메일 확인이 필요함

**해결 방법 1: 이메일 확인 (프로덕션)**
- 이메일 받은편지함에서 인증 링크 클릭

**해결 방법 2: 이메일 확인 비활성화 (개발 환경)**
1. `Authentication` → `Settings` 이동
2. "Enable email confirmations" 옵션을 **비활성화**
3. 변경 사항 저장
4. 앱에서 다시 로그인 시도

#### 시나리오 C: 사용자가 있고 이메일도 확인됨
**원인:** 비밀번호가 틀렸거나 다른 문제

**해결 방법:**
1. 비밀번호 재설정 시도
2. 또는 Supabase 대시보드에서 비밀번호 직접 변경

### 4. 비밀번호 재설정 (Supabase 대시보드)

1. `Authentication` → `Users` 이동
2. 사용자 선택
3. "Reset Password" 버튼 클릭
4. 새 비밀번호 설정

### 5. 테스트 사용자 생성 (개발용)

Supabase 대시보드에서 직접 사용자 생성:
1. `Authentication` → `Users` → `Add User`
2. 이메일과 비밀번호 입력
3. "Auto Confirm User" 체크 (이메일 확인 없이 바로 사용 가능)
4. 생성 후 앱에서 로그인 시도

### 6. 로그 확인

`Authentication` → `Logs`에서 인증 시도 로그 확인:
- 로그인 시도 시간
- 성공/실패 여부
- 에러 메시지

## 빠른 체크리스트

- [ ] Supabase 대시보드에서 사용자 목록 확인
- [ ] 사용자가 존재하는지 확인
- [ ] 이메일 확인 상태 확인 (`email_confirmed_at`)
- [ ] 이메일 확인이 필요하면 비활성화 (개발 환경)
- [ ] 비밀번호가 올바른지 확인
- [ ] 앱에서 회원가입부터 다시 시도

## 개발 환경 권장 설정

개발 중에는 다음 설정을 권장합니다:

1. **이메일 확인 비활성화**
   - `Authentication` → `Settings` → "Enable email confirmations" OFF

2. **비밀번호 정책 완화** (선택사항)
   - `Authentication` → `Settings` → "Password Requirements" 조정

3. **테스트 사용자 생성**
   - 대시보드에서 직접 생성하여 빠른 테스트 가능

