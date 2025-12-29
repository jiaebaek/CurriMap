# 환경 변수 설정 가이드

CurriMap 프로젝트의 환경 변수 설정 방법을 단계별로 안내합니다.

## 📋 목차

1. [Supabase 설정 값 가져오기](#1-supabase-설정-값-가져오기)
2. [백엔드 환경 변수 설정](#2-백엔드-환경-변수-설정)
3. [프론트엔드 환경 변수 설정](#3-프론트엔드-환경-변수-설정)
4. [환경 변수 확인](#4-환경-변수-확인)

---

## 1. Supabase 설정 값 가져오기

### Step 1: Supabase 프로젝트 접속

1. [Supabase Dashboard](https://app.supabase.com)에 로그인
2. 프로젝트 선택 (또는 새 프로젝트 생성)

### Step 2: 프로젝트 설정에서 값 확인

1. 좌측 메뉴에서 **Settings** (⚙️) 클릭
2. **API** 메뉴 클릭

### Step 3: 필요한 값 복사

다음 값들을 복사해두세요:

- **Project URL**: `https://xxxxx.supabase.co` 형식
- **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` 형식
- **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` 형식 (⚠️ 보안 주의)

> ⚠️ **주의**: `service_role key`는 절대 프론트엔드에 노출하면 안 됩니다! 백엔드에서만 사용하세요.

---

## 2. 백엔드 환경 변수 설정

### Step 1: .env 파일 생성

```bash
cd backend
touch .env
```

또는 Windows에서는:
```powershell
cd backend
New-Item .env
```

### Step 2: .env 파일 내용 작성

`backend/.env` 파일을 열고 다음 내용을 입력하세요:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1yZWYiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTI5ODQwMCwiZXhwIjoxOTYwODc0NDAwfQ.your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1yZWYiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ1Mjk4NDAwLCJleHAiOjE5NjA4NzQ0MDB9.your-service-role-key-here

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:19006
```

### Step 3: 실제 값으로 교체

위 예시의 `your-project-ref`, `your-anon-key-here`, `your-service-role-key-here`를 실제 Supabase에서 복사한 값으로 교체하세요.

### 예시 (실제 값)

```env
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTI5ODQwMCwiZXhwIjoxOTYwODc0NDAwfQ.실제_anon_키_값
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ1Mjk4NDAwLCJleHAiOjE5NjA4NzQ0MDB9.실제_service_role_키_값
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:19006
```

> 💡 **팁**: `CORS_ORIGIN`은 Expo 개발 서버의 기본 포트인 `19006`을 사용합니다. 다른 포트를 사용한다면 해당 포트로 변경하세요.

---

## 3. 프론트엔드 환경 변수 설정

### Step 1: .env 파일 생성

```bash
cd frontend
touch .env
```

또는 Windows에서는:
```powershell
cd frontend
New-Item .env
```

### Step 2: .env 파일 내용 작성

`frontend/.env` 파일을 열고 다음 내용을 입력하세요:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1yZWYiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTI5ODQwMCwiZXhwIjoxOTYwODc0NDAwfQ.your-anon-key-here

# Backend API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Step 3: 실제 값으로 교체

- `your-project-ref`: Supabase 프로젝트 URL의 프로젝트 참조 ID
- `your-anon-key-here`: Supabase의 anon public key
- `http://localhost:3000/api`: 백엔드 서버가 실행되는 URL (로컬 개발 시)

### 예시 (실제 값)

```env
EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTI5ODQwMCwiZXhwIjoxOTYwODc0NDAwfQ.실제_anon_키_값
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

> ⚠️ **중요**: Expo에서는 환경 변수 이름 앞에 `EXPO_PUBLIC_` 접두사가 있어야 클라이언트에서 접근 가능합니다!

---

## 4. 환경 변수 확인

### 백엔드 확인

```bash
cd backend
node -e "require('dotenv').config(); console.log('SUPABASE_URL:', process.env.SUPABASE_URL);"
```

또는 간단히:

```bash
cd backend
npm run dev
# 서버가 정상적으로 시작되면 환경 변수가 올바르게 설정된 것입니다
```

### 프론트엔드 확인

```bash
cd frontend
npm start
# Expo 개발 서버가 시작되면 환경 변수가 로드됩니다
```

또는 코드에서 확인:

```javascript
// frontend/src/config/supabase.js에서
console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
```

---

## 🔍 문제 해결

### 문제 1: "Missing Supabase environment variables" 에러

**원인**: 환경 변수가 제대로 로드되지 않음

**해결 방법**:
1. `.env` 파일이 `backend/` 또는 `frontend/` 디렉토리 루트에 있는지 확인
2. 파일 이름이 정확히 `.env`인지 확인 (`.env.txt` 아님)
3. 서버를 재시작해보세요

### 문제 2: 프론트엔드에서 환경 변수가 undefined

**원인**: Expo 환경 변수 이름에 `EXPO_PUBLIC_` 접두사가 없음

**해결 방법**:
- 모든 프론트엔드 환경 변수 이름 앞에 `EXPO_PUBLIC_` 추가
- Expo 개발 서버 재시작

### 문제 3: CORS 오류

**원인**: 백엔드의 `CORS_ORIGIN`이 프론트엔드 URL과 일치하지 않음

**해결 방법**:
1. Expo 개발 서버의 실제 URL 확인 (터미널에 표시됨)
2. `backend/.env`의 `CORS_ORIGIN`을 해당 URL로 변경
3. 백엔드 서버 재시작

---

## 📝 체크리스트

설정 완료 후 다음을 확인하세요:

### 백엔드
- [ ] `backend/.env` 파일 생성됨
- [ ] `SUPABASE_URL` 설정됨
- [ ] `SUPABASE_ANON_KEY` 설정됨
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 설정됨
- [ ] `PORT` 설정됨 (기본값: 3000)
- [ ] `CORS_ORIGIN` 설정됨
- [ ] 서버가 정상적으로 시작됨

### 프론트엔드
- [ ] `frontend/.env` 파일 생성됨
- [ ] `EXPO_PUBLIC_SUPABASE_URL` 설정됨
- [ ] `EXPO_PUBLIC_SUPABASE_ANON_KEY` 설정됨
- [ ] `EXPO_PUBLIC_API_URL` 설정됨
- [ ] Expo 개발 서버가 정상적으로 시작됨

---

## 🚀 다음 단계

환경 변수 설정이 완료되면:

1. **데이터베이스 마이그레이션 실행**
   - `database/MIGRATION_GUIDE.md` 참고

2. **백엔드 서버 실행**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **프론트엔드 실행**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **테스트**
   - 회원가입/로그인 테스트
   - API 연결 테스트

---

## 🔐 보안 주의사항

1. **절대 `.env` 파일을 Git에 커밋하지 마세요!**
   - `.gitignore`에 이미 포함되어 있습니다
   - 실수로 커밋했다면 즉시 키를 재생성하세요

2. **프로덕션 환경에서는**
   - 환경 변수를 서버의 환경 변수 설정에서 관리하세요
   - `.env` 파일을 직접 배포하지 마세요

3. **`service_role` 키는**
   - 백엔드에서만 사용하세요
   - 프론트엔드에 절대 노출하지 마세요

---

## 📞 추가 도움

문제가 계속되면:
1. Supabase Dashboard에서 키가 올바른지 확인
2. 프로젝트가 활성화되어 있는지 확인
3. 네트워크 연결 확인

