# 백엔드 연결 문제 해결 가이드

## "Failed to fetch" 에러 해결 방법

이 에러는 프론트엔드가 백엔드 서버에 연결할 수 없을 때 발생합니다.

## 🔍 문제 진단

### 1. 백엔드 서버가 실행 중인지 확인

**터미널에서 확인:**
```bash
cd backend
npm run dev
```

서버가 실행되면 다음과 같은 메시지가 표시됩니다:
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

### 2. Health Check 테스트

**브라우저에서:**
```
http://localhost:3000/health
```

또는 **PowerShell에서:**
```powershell
curl http://localhost:3000/health
```

정상 응답:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 3. IP 주소 확인

**PowerShell에서:**
```powershell
ipconfig
```

**IPv4 주소**를 찾으세요. 예:
```
IPv4 주소 . . . . . . . . . . . : 192.168.0.100
```

⚠️ **주의:** `192.168.0.1`은 보통 라우터 주소입니다. 실제 PC IP가 아닐 수 있습니다.

### 4. 프론트엔드 API URL 확인

**앱 시작 시 콘솔에서:**
```
🔗 [API] API URL: http://192.168.0.1:3000/api
```

이 URL이 올바른지 확인하세요.

## ✅ 해결 방법

### 방법 1: 백엔드 서버 시작

1. **새 터미널 창** 열기
2. 백엔드 디렉토리로 이동:
   ```bash
   cd backend
   ```
3. 서버 시작:
   ```bash
   npm run dev
   ```

### 방법 2: 올바른 IP 주소 사용

1. **실제 PC IP 주소 확인:**
   ```powershell
   ipconfig
   ```
   
2. **프론트엔드 `.env` 파일 수정:**
   ```env
   EXPO_PUBLIC_API_URL=http://[실제_IP_주소]:3000/api
   ```
   
   예:
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.0.100:3000/api
   ```

3. **Metro Bundler 재시작:**
   - Metro Bundler 중지 (`Ctrl + C`)
   - 다시 시작:
     ```bash
     npm start -- --clear
     ```

### 방법 3: localhost 사용 (에뮬레이터/시뮬레이터)

**Android 에뮬레이터:**
- `localhost` 대신 `10.0.2.2` 사용
- `.env` 파일:
  ```env
  EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api
  ```

**iOS 시뮬레이터:**
- `localhost` 사용 가능
- `.env` 파일:
  ```env
  EXPO_PUBLIC_API_URL=http://localhost:3000/api
  ```

### 방법 4: 백엔드 서버가 모든 인터페이스에서 리스닝하도록 확인

백엔드 서버가 `0.0.0.0`에서 리스닝하도록 설정되어 있는지 확인:

```javascript
// backend/src/index.js
app.listen(PORT, '0.0.0.0', () => {
  // ...
});
```

## 🧪 테스트 순서

1. ✅ 백엔드 서버 실행 확인
2. ✅ Health Check 테스트 (`http://localhost:3000/health`)
3. ✅ IP 주소 확인 (`ipconfig`)
4. ✅ 프론트엔드 `.env` 파일 확인
5. ✅ Metro Bundler 재시작
6. ✅ 앱에서 다시 시도

## 💡 빠른 체크리스트

- [ ] 백엔드 서버가 실행 중인가?
- [ ] `http://localhost:3000/health`가 응답하는가?
- [ ] 실제 PC IP 주소를 확인했는가?
- [ ] 프론트엔드 `.env` 파일의 IP 주소가 올바른가?
- [ ] Metro Bundler를 재시작했는가?

## 🔧 추가 디버깅

**프론트엔드 콘솔에서 확인:**
```
🔗 [API] API URL: [URL]
📤 [API] OUTGOING REQUEST
   URL: [전체 URL]
```

**백엔드 콘솔에서 확인:**
- 요청이 도착하는지 확인
- 에러 메시지 확인

