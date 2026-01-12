# 프론트엔드 디버깅 가이드

프론트엔드에서 발생하는 에러와 API 요청을 확인하는 방법입니다.

## 📱 로그 확인 방법

### 1. Metro Bundler 콘솔 (주요 방법)

Expo 앱을 실행하면 **터미널에 Metro Bundler가 시작**됩니다. 여기서 모든 `console.log`, `console.error` 등을 확인할 수 있습니다.

```bash
cd frontend
npm start
```

터미널에서 다음과 같은 로그를 볼 수 있습니다:

```
📤 [API] OUTGOING REQUEST
Method: POST
URL: http://localhost:3000/api/children
...
```

### 2. React Native Debugger

앱에서 디버깅 모드를 활성화:

1. **iOS 시뮬레이터**: `Cmd + D` → "Debug" 선택
2. **Android 에뮬레이터**: `Cmd + M` (Mac) 또는 `Ctrl + M` (Windows) → "Debug" 선택
3. 브라우저에서 Chrome DevTools가 열립니다

### 3. Expo Dev Tools

Expo 앱을 실행하면 브라우저에 자동으로 Dev Tools가 열립니다:
- `http://localhost:19000` (또는 표시된 포트)

여기서 로그를 확인할 수 있습니다.

### 4. 물리 기기에서 실행 시

**Android:**
```bash
adb logcat | grep -i "ReactNativeJS"
```

**iOS:**
- Xcode에서 실행하면 콘솔에 로그가 표시됩니다
- 또는 Safari → Develop → [기기명] → [앱명] → Console

## 🔍 API 요청 로깅

모든 API 요청은 자동으로 로깅됩니다:

### 요청 로그 형식

```
================================================================================
📤 [API] OUTGOING REQUEST
Method: POST
URL: http://localhost:3000/api/children
Endpoint: /children
Body: {
  "nickname": "테스트",
  "birth_months": 36,
  "gender": "male"
}
Has Token: Yes
================================================================================
```

### 응답 로그 형식

**성공 시:**
```
================================================================================
📥 [API] INCOMING RESPONSE
Status: 201 Created
Response Time: 123ms
URL: http://localhost:3000/api/children
✅ Success Response: {
  "data": {
    "id": 1,
    ...
  }
}
================================================================================
```

**에러 시:**
```
⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠
❌ [API] ERROR OCCURRED
URL: http://localhost:3000/api/children
Method: POST
Response Time: 50ms
Error Type: TypeError
Error Message: Network error: Failed to fetch
💡 Check if backend server is running and URL is correct
   Backend URL should be: http://localhost:3000/api
Stack Trace: ...
⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠
```

## 🐛 일반적인 문제 해결

### 문제 1: 백엔드에 요청이 안 가는 경우

**증상:**
- 프론트엔드에서 에러 발생
- 백엔드 콘솔에 로그 없음

**확인 사항:**

1. **API URL 확인**
   ```javascript
   // frontend/src/config/api.js
   const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
   ```
   
   Metro 콘솔에서 실제 요청 URL 확인:
   ```
   📤 [API] OUTGOING REQUEST
   URL: http://localhost:3000/api/children  ← 이 URL이 맞는지 확인
   ```

2. **백엔드 서버 실행 확인**
   ```bash
   cd backend
   npm run dev
   ```
   
   백엔드 콘솔에 다음 메시지가 보여야 합니다:
   ```
   🚀 백엔드 서버가 시작되었습니다!
   ```

3. **네트워크 에러 확인**
   - Metro 콘솔에서 `Network error` 메시지 확인
   - `TypeError: Failed to fetch` → 백엔드 서버가 실행되지 않았거나 URL이 잘못됨

### 문제 2: CORS 에러

**증상:**
- 브라우저 콘솔에 CORS 에러
- 네트워크 탭에서 401/403 에러

**해결:**
- 백엔드의 CORS 설정 확인
- `EXPO_PUBLIC_API_URL` 환경 변수 확인

### 문제 3: 인증 토큰 문제

**확인:**
```
📤 [API] OUTGOING REQUEST
Has Token: No  ← 토큰이 없으면 인증 에러 발생
```

**해결:**
- Supabase 세션 확인
- 로그인 상태 확인

## 🔧 환경 변수 확인

`.env` 파일 (또는 `app.json`의 `extra` 섹션)에서:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

**중요:** 환경 변수 변경 후 앱을 **완전히 재시작**해야 합니다:
1. Metro Bundler 중지 (`Ctrl + C`)
2. `npm start` 다시 실행
3. 앱 재시작 (Expo Go에서 새로고침)

## 📊 로그 레벨

### 개발 환경에서 모든 로그 보기

`api.js`에서 로깅이 자동으로 활성화되어 있습니다. 프로덕션에서는 환경 변수로 제어할 수 있습니다:

```javascript
const DEBUG = process.env.NODE_ENV === 'development';
if (DEBUG) {
  console.log('...');
}
```

## 💡 디버깅 팁

1. **요청이 전송되는지 확인**
   - Metro 콘솔에서 `📤 [API] OUTGOING REQUEST` 로그 확인
   - 이 로그가 없으면 API 함수가 호출되지 않은 것

2. **응답이 오는지 확인**
   - `📥 [API] INCOMING RESPONSE` 로그 확인
   - 이 로그가 없으면 네트워크 레벨에서 실패

3. **에러 타입 확인**
   - `TypeError` → 네트워크 문제 (서버 미실행, URL 오류)
   - `Error` → API 에러 (400, 401, 500 등)

4. **백엔드와 프론트엔드 로그 비교**
   - 프론트엔드: 요청 전송 확인
   - 백엔드: 요청 수신 확인
   - 둘 다 확인하면 어디서 문제가 발생했는지 알 수 있음


