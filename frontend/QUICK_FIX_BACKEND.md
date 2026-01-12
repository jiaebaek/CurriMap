# 백엔드 서버 빠른 시작 가이드

## ⚠️ "Failed to fetch" 에러 해결

이 에러는 백엔드 서버가 실행되지 않아서 발생합니다.

## 🚀 해결 방법

### 1. 백엔드 서버 시작

**새 터미널 창을 열고:**

```bash
cd backend
npm run dev
```

서버가 시작되면 다음과 같은 메시지가 표시됩니다:

```
================================================================================
🚀 백엔드 서버가 시작되었습니다!
================================================================================
📍 Port: 3000
📝 Environment: development
🌐 Health Check: http://localhost:3000/health
🔗 API Base URL: http://localhost:3000/api
================================================================================
```

### 2. 서버 실행 확인

**브라우저에서:**
```
http://localhost:3000/health
```

또는 **PowerShell에서:**
```powershell
Invoke-WebRequest -Uri http://localhost:3000/health
```

정상 응답:
```json
{"status":"ok","timestamp":"..."}
```

### 3. 프론트엔드에서 다시 시도

백엔드 서버가 실행 중이면 프론트엔드 앱에서 다시 시도하세요.

## 📋 체크리스트

- [ ] 백엔드 서버 실행 (`cd backend && npm run dev`)
- [ ] Health Check 응답 확인 (`http://localhost:3000/health`)
- [ ] 프론트엔드 앱에서 다시 시도

## 💡 팁

백엔드 서버는 별도의 터미널 창에서 계속 실행되어야 합니다.
프론트엔드와 백엔드를 동시에 실행하려면:
- 터미널 1: 백엔드 서버 (`cd backend && npm run dev`)
- 터미널 2: 프론트엔드 앱 (`cd frontend && npm start`)

