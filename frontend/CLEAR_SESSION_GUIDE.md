# 세션 클리어 가이드

## 문제 상황
- Supabase에서 사용자를 삭제했는데도 앱이 여전히 로그인 상태로 표시됨
- AsyncStorage에 이전 세션이 남아있어서 발생하는 문제

## 해결 방법

### 방법 1: 앱 재시작 (가장 간단) ⭐

1. 앱을 완전히 종료
2. 다시 실행
3. 이제 세션 유효성 검증이 작동하여 삭제된 사용자의 세션은 자동으로 클리어됨

### 방법 2: 로그아웃 버튼 사용

1. 앱에서 마이페이지로 이동
2. "로그아웃" 버튼 클릭
3. 세션이 완전히 제거됨

### 방법 3: 개발용 세션 클리어 (코드 수정 후)

코드에 세션 유효성 검증이 추가되어 있어서:
- 앱 시작 시 자동으로 세션 검증
- 삭제된 사용자의 세션은 자동으로 클리어
- 유효하지 않은 세션은 제거됨

## 수정된 내용

### 1. 세션 유효성 검증 추가

앱 시작 시:
1. AsyncStorage에서 세션 읽기
2. 세션이 있으면 Supabase에 사용자 존재 여부 확인
3. 사용자가 없으면 세션 자동 제거
4. 로그인 화면 표시

### 2. 로그아웃 기능 개선

- `signOut()` 함수가 세션과 상태를 완전히 초기화
- AsyncStorage에서도 세션 제거

## 확인 방법

앱 재시작 후 콘솔에서 다음 로그 확인:

**세션이 있지만 사용자가 삭제된 경우:**
```
✅ [Auth] Existing session found
   User ID: abc123...
⚠️ [Auth] Session exists but user is invalid, clearing session...
   Error: User not found
```

**세션이 없는 경우:**
```
ℹ️ [Auth] No existing session found
```

**정상적인 세션이 있는 경우:**
```
✅ [Auth] Existing session found
   User ID: abc123...
✅ [Auth] Session validated, user exists
```

## 개발 팁

### 세션 강제 클리어 (개발용)

코드에 `clearSession()` 함수가 추가되어 있습니다:
```javascript
const { clearSession } = useAuth();
await clearSession();
```

이 함수는 개발 중 세션을 강제로 클리어할 때 유용합니다.

## 프로덕션 고려사항

프로덕션에서는:
- 사용자가 삭제되면 자동으로 로그아웃 처리됨
- 유효하지 않은 세션은 자동으로 제거됨
- 보안이 향상됨

