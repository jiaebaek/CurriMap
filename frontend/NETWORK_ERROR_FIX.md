# Network Request Failed 에러 해결 가이드

## 🔴 에러 메시지

```
TypeError: Network request failed
```

이 에러는 프론트엔드가 백엔드 서버에 연결하지 못할 때 발생합니다.

## ✅ 해결 방법

### 1단계: 백엔드 서버 실행 확인

**새 터미널 창**을 열고:

```bash
cd backend
npm run dev
```

백엔드 콘솔에 다음 메시지가 보여야 합니다:

```
================================================================================
🚀 백엔드 서버가 시작되었습니다!
================================================================================
📍 Port: 3000
🌐 Health Check: http://localhost:3000/health
```

### 2단계: API URL 확인

#### 웹 브라우저에서 실행하는 경우

`.env` 파일 또는 `api.js`에서:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

이 설정이면 정상 작동해야 합니다.

#### 모바일 기기/에뮬레이터에서 실행하는 경우 ⚠️

**문제:** 모바일 기기나 에뮬레이터에서 `localhost`는 **기기 자체**를 가리킵니다. PC의 백엔드 서버에 접근하려면 **PC의 IP 주소**를 사용해야 합니다.

**해결:**

1. **PC의 IP 주소 확인**

   **Windows:**
   ```powershell
   ipconfig
   ```
   출력에서 `IPv4 주소` 찾기 (예: `192.168.0.1`)

   **Mac/Linux:**
   ```bash
   ifconfig
   # 또는
   ip addr
   ```

2. **환경 변수 설정**

   `frontend` 폴더에 `.env` 파일 생성 (없다면):

   ```env
   EXPO_PUBLIC_API_URL=http://192.168.0.1:3000/api
   ```

   ⚠️ **중요:** `192.168.0.1`을 실제 PC IP 주소로 변경하세요!

3. **Metro Bundler 재시작**

   환경 변수를 변경했으면 **반드시 재시작**해야 합니다:

   ```bash
   # Metro Bundler 중지 (Ctrl + C)
   # 그 다음 다시 시작
   npm start
   ```

4. **앱 재시작**

   - Expo Go에서 앱 새로고침
   - 또는 앱 완전 종료 후 다시 실행

### 3단계: 연결 테스트

백엔드가 실행 중인 상태에서:

**웹 브라우저:**
```
http://localhost:3000/health
```

**모바일/에뮬레이터:**
```
http://[PC_IP]:3000/health
```

예: `http://192.168.0.1:3000/health`

응답이 오면 정상입니다:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

## 🔍 추가 확인 사항

### 방화벽 확인

Windows 방화벽이 포트 3000을 차단하지 않는지 확인:

1. Windows 보안 → 방화벽 및 네트워크 보호
2. 고급 설정
3. 인바운드 규칙 → 새 규칙
4. 포트 → TCP → 3000 → 허용

### 같은 네트워크인지 확인

모바일 기기와 PC가 **같은 Wi-Fi 네트워크**에 연결되어 있어야 합니다.

### 백엔드 CORS 설정 확인

`backend/src/index.js`에서:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',  // 개발 환경에서는 '*' 허용
  credentials: true,
}));
```

## 📱 빠른 체크리스트

- [ ] 백엔드 서버 실행 중 (`npm run dev`)
- [ ] 백엔드 콘솔에 "🚀 백엔드 서버가 시작되었습니다!" 메시지 확인
- [ ] 모바일 실행 시: PC IP 주소 사용 (localhost 아님)
- [ ] `.env` 파일에 `EXPO_PUBLIC_API_URL` 설정
- [ ] Metro Bundler 재시작 (환경 변수 변경 후)
- [ ] 앱 재시작
- [ ] PC와 모바일이 같은 Wi-Fi 네트워크

## 💡 디버깅 팁

### Metro 콘솔에서 확인

앱 실행 시 Metro 콘솔에 다음 로그가 나타납니다:

```
🔗 [API] API URL: http://localhost:3000/api
💡 모바일에서 실행 중이라면 localhost 대신 PC IP 주소를 사용하세요
```

이 로그에서 실제 사용 중인 URL을 확인할 수 있습니다.

### 에러 로그 확인

에러 발생 시 Metro 콘솔에 상세한 해결 방법이 표시됩니다:

```
🔧 문제 해결 방법:
1. 백엔드 서버가 실행 중인지 확인:
   cd backend && npm run dev
...
```

## 🚀 예시: 실제 설정

**PC IP 주소:** `192.168.0.100`

**frontend/.env:**
```env
EXPO_PUBLIC_API_URL=http://192.168.0.100:3000/api
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

**백엔드 실행:**
```bash
cd backend
npm run dev
```

**프론트엔드 실행:**
```bash
cd frontend
npm start
```

이제 모바일 기기에서도 정상 작동해야 합니다!


