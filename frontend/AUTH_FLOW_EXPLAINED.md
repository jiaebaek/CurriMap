# 인증 플로우 설명

현재 구현된 인증 방식이 어떻게 작동하는지 설명합니다.

## 🔐 현재 인증 방식

### 1. 회원가입 플로우

```
사용자 입력 (이메일, 비밀번호)
    ↓
프론트엔드: supabase.auth.signUp()
    ↓
Supabase Auth: auth.users 테이블에 사용자 생성
    ↓
Database Trigger: users 테이블에 자동 추가 (011_auto_create_user_trigger.sql)
    ↓
세션 생성 및 AsyncStorage에 저장
    ↓
onAuthStateChange 이벤트 발생
    ↓
AuthContext에서 user, session 상태 업데이트
```

### 2. 로그인 플로우

```
사용자 입력 (이메일, 비밀번호)
    ↓
프론트엔드: supabase.auth.signInWithPassword()
    ↓
Supabase Auth: 인증 확인
    ↓
세션 생성 (JWT 토큰 포함)
    ↓
AsyncStorage에 세션 저장 (persistSession: true)
    ↓
onAuthStateChange 이벤트 발생
    ↓
AuthContext에서 user, session 상태 업데이트
```

### 3. API 요청 시 토큰 사용

```
API 요청 시작
    ↓
apiRequest() 함수 호출
    ↓
supabase.auth.getSession() - AsyncStorage에서 세션 가져오기
    ↓
session.access_token 추출
    ↓
Authorization: Bearer {token} 헤더에 추가
    ↓
백엔드로 요청 전송
    ↓
백엔드: supabase.auth.getUser(token) - 토큰 검증
    ↓
검증 성공 시 req.userId 설정
    ↓
API 로직 실행
```

## ✅ 작동하는 이유

### 1. Supabase Auth의 표준 방식

- Supabase는 JWT(JSON Web Token) 기반 인증을 사용
- `signInWithPassword()` 호출 시 자동으로 JWT 토큰 생성
- 토큰은 `session.access_token`에 포함됨

### 2. 세션 자동 저장

```javascript
// frontend/src/config/supabase.js
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,        // 세션을 AsyncStorage에 저장
    autoRefreshToken: true,        // 토큰 자동 갱신
    persistSession: true,          // 앱 재시작 시에도 세션 유지
  },
});
```

- `persistSession: true` → 앱을 종료해도 로그인 상태 유지
- `autoRefreshToken: true` → 토큰 만료 전 자동 갱신
- `storage: AsyncStorage` → React Native의 로컬 스토리지에 저장

### 3. 토큰 검증

백엔드에서:
```javascript
// backend/src/middleware/auth.js
const { data: { user }, error } = await supabase.auth.getUser(token);
```

- Supabase가 토큰의 유효성을 검증
- 유효하면 사용자 정보 반환
- 무효하면 401 에러 반환

## 🔍 토큰 정보 확인

### 프론트엔드에서 확인

Metro 콘솔에서:
```
✅ [API] Session found, token available
   Token expires at: 2024-01-01T12:00:00.000Z
```

### 세션 정보 구조

```javascript
session = {
  access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // JWT 토큰
  refresh_token: "...",                                      // 갱신 토큰
  expires_at: 1704110400,                                  // 만료 시간 (Unix timestamp)
  expires_in: 3600,                                         // 만료까지 시간 (초)
  user: {
    id: "uuid",
    email: "user@example.com",
    ...
  }
}
```

## ⚠️ 주의사항

### 1. 토큰 만료

- 기본적으로 1시간 후 만료
- `autoRefreshToken: true`로 자동 갱신됨
- 하지만 네트워크 문제 등으로 갱신 실패 시 로그인 필요

### 2. 세션 로딩 타이밍

앱 시작 시:
```javascript
// AuthContext에서
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    // 세션 로딩 완료
  });
}, []);
```

- 초기 로딩 중에는 `loading: true`
- 세션 로딩 완료 후 `loading: false`
- 이 시간 동안 API 요청하면 토큰이 없을 수 있음

### 3. "Has Token: No" 문제

발생 가능한 경우:
1. **로그인하지 않음** → 로그인 필요
2. **세션 로딩 중** → `loading` 상태 확인
3. **토큰 만료 및 갱신 실패** → 재로그인 필요
4. **AsyncStorage 문제** → 앱 재설치 또는 스토리지 초기화

## 🧪 테스트 방법

### 1. 로그인 후 토큰 확인

```javascript
// Metro 콘솔에서 확인
📤 [API] OUTGOING REQUEST
Has Token: Yes  ← 이게 보이면 정상
```

### 2. 백엔드에서 확인

백엔드 로그에서:
```
[2024-01-01T12:00:00.000Z] 📥 INCOMING REQUEST
User ID: abc123-def456-...  ← 사용자 ID가 보이면 인증 성공
```

### 3. 수동 확인

```javascript
// 개발자 도구에서
const { data } = await supabase.auth.getSession();
console.log('Token:', data.session?.access_token);
console.log('User:', data.session?.user);
```

## 💡 개선 사항

현재 구현은 정상 작동하지만, 다음을 추가할 수 있습니다:

1. **토큰 만료 전 갱신**: 이미 `autoRefreshToken: true`로 처리됨
2. **에러 처리 개선**: 토큰 만료 시 자동 재로그인 (선택적)
3. **로딩 상태 표시**: API 요청 전 세션 로딩 완료 확인

## ✅ 결론

**현재 방식은 정상적으로 작동합니다!**

- ✅ 로그인: Supabase Auth로 처리
- ✅ 토큰 저장: AsyncStorage에 자동 저장
- ✅ 토큰 사용: API 요청 시 자동으로 헤더에 추가
- ✅ 토큰 검증: 백엔드에서 Supabase가 자동 검증
- ✅ 토큰 갱신: 자동으로 처리됨

"Has Token: No" 문제는 로그인하지 않았거나 세션이 로딩 중일 때 발생합니다.


