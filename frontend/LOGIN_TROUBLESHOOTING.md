# 로그인 문제 해결 가이드

## "Invalid login credentials" 에러 해결 방법

이 에러는 다음 중 하나의 이유로 발생할 수 있습니다:

### 1. 회원가입을 먼저 해야 합니다

**해결 방법:**
- 앱에서 "계정이 없으신가요? 회원가입" 버튼을 클릭
- 이메일과 비밀번호를 입력하여 회원가입 진행
- 회원가입 후 로그인 시도

### 2. 이메일 확인이 필요한 경우

Supabase 설정에서 이메일 확인이 활성화되어 있으면:
- 회원가입 후 이메일을 확인해야 로그인 가능
- 이메일 받은편지함에서 인증 링크 클릭 필요

**개발 환경에서 이메일 확인 비활성화 방법:**
1. Supabase 대시보드 접속
2. Authentication → Settings 이동
3. "Enable email confirmations" 옵션을 **비활성화**
4. 변경 사항 저장

### 3. 이메일/비밀번호 입력 오류

**확인 사항:**
- 이메일 주소에 공백이 없는지 확인
- 대소문자 구분 없음 (자동으로 소문자로 변환됨)
- 비밀번호가 정확한지 확인
- 회원가입 시 사용한 이메일과 동일한지 확인

### 4. 디버깅 방법

콘솔에서 다음 로그를 확인하세요:

```
🔐 [Auth] Attempting sign in...
   Email: your-email@example.com
   Password length: 8
```

로그인 실패 시:
```
❌ [Auth] Sign in error: ...
   Error code: invalid_credentials
   Error message: Invalid login credentials
```

### 5. 테스트 시나리오

**시나리오 1: 새 사용자**
1. 회원가입 화면으로 전환
2. 이메일과 비밀번호 입력
3. 회원가입 버튼 클릭
4. 성공 메시지 확인
5. 로그인 화면으로 전환
6. 동일한 이메일/비밀번호로 로그인 시도

**시나리오 2: 기존 사용자**
1. 로그인 화면에서 이메일/비밀번호 입력
2. 로그인 버튼 클릭
3. 성공 시 메인 화면으로 이동

### 6. Supabase 설정 확인

Supabase 대시보드에서 확인할 사항:

1. **Authentication → Users**
   - 사용자가 생성되었는지 확인
   - 이메일 확인 상태 확인 (`email_confirmed_at` 필드)

2. **Authentication → Settings**
   - "Enable email confirmations" 설정 확인
   - 개발 중이라면 비활성화 권장

3. **Project Settings → API**
   - `EXPO_PUBLIC_SUPABASE_URL`과 `EXPO_PUBLIC_SUPABASE_ANON_KEY`가 올바른지 확인

### 7. 코드에서 확인할 수 있는 정보

`frontend/src/context/AuthContext.js`의 `signIn` 함수에서:
- 입력한 이메일이 로그에 출력됨
- 비밀번호 길이가 로그에 출력됨 (보안상 실제 비밀번호는 출력되지 않음)
- 에러 코드와 메시지가 상세히 로그에 출력됨

### 8. 빠른 해결 방법

1. **회원가입부터 다시 시작**
   ```
   회원가입 → 이메일 확인 (필요시) → 로그인
   ```

2. **Supabase에서 직접 확인**
   - Supabase 대시보드 → Authentication → Users
   - 사용자 목록에서 이메일 확인
   - 필요시 비밀번호 재설정

3. **앱 재시작**
   - 앱을 완전히 종료하고 다시 시작
   - 세션 캐시 문제일 수 있음

## 추가 도움말

문제가 계속되면 다음 정보를 확인하세요:
- 콘솔의 전체 에러 로그
- Supabase 대시보드의 Authentication 로그
- 사용한 이메일 주소
- 회원가입 시점과 로그인 시도 시점

