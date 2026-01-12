# 🚀 배포 전 체크리스트

## ⚠️ 현재 상태: 바로 배포 불가

현재 개발 환경에서는 실행되지만, 프로덕션 배포를 위해서는 다음 항목들을 완료해야 합니다.

---

## ✅ 필수 사항 (배포 전 반드시 완료)

### 1. 환경 변수 설정 (.env 파일)
- [ ] `frontend/.env` 파일 생성
- [ ] Supabase 프로덕션 URL 설정
- [ ] Supabase 프로덕션 Anon Key 설정
- [ ] 백엔드 API 프로덕션 URL 설정

**필요한 환경 변수:**
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
EXPO_PUBLIC_API_URL=https://your-backend-api.com/api
```

### 2. Assets 이미지 파일
- [ ] `frontend/assets/icon.png` (1024x1024)
- [ ] `frontend/assets/splash.png` (2048x2048 권장)
- [ ] `frontend/assets/adaptive-icon.png` (1024x1024)
- [ ] `frontend/assets/favicon.png` (48x48)
- [ ] `app.json`에서 이미지 참조 복원

**자세한 내용:** `frontend/TODO_ASSETS.md` 참고

### 3. EAS Build 설정
- [ ] Expo 계정 생성 및 로그인
- [ ] `eas.json` 설정 파일 생성
- [ ] 빌드 프로파일 설정 (development, preview, production)

**설정 방법:**
```bash
cd frontend
npx eas-cli login
npx eas-cli build:configure
```

### 4. 백엔드 서버 배포
- [ ] 백엔드 서버 프로덕션 환경 배포
- [ ] 환경 변수 설정 (Supabase, JWT 등)
- [ ] CORS 설정 확인
- [ ] API 엔드포인트 테스트

### 5. Supabase 프로덕션 설정
- [ ] 프로덕션 Supabase 프로젝트 생성
- [ ] 데이터베이스 마이그레이션 실행
- [ ] RLS (Row Level Security) 정책 확인
- [ ] 환경 변수 업데이트

---

## 🔧 권장 사항

### 6. 앱 정보 설정
- [ ] `app.json`의 앱 이름, 버전 확인
- [ ] Bundle Identifier / Package Name 확인
- [ ] 앱 설명 및 카테고리 설정

### 7. 테스트
- [ ] 개발 빌드 테스트
- [ ] 프로덕션 빌드 테스트
- [ ] 주요 기능 동작 확인
- [ ] 에러 핸들링 확인

### 8. 보안
- [ ] 환경 변수 Git에 커밋되지 않았는지 확인
- [ ] `.gitignore`에 `.env` 포함 확인
- [ ] API 키 보안 확인

### 9. 성능 최적화
- [ ] 이미지 최적화
- [ ] 번들 크기 확인
- [ ] 로딩 시간 최적화

---

## 📱 배포 단계

### Step 1: EAS Build 설정
```bash
cd frontend
npx eas-cli login
npx eas-cli build:configure
```

### Step 2: 개발 빌드 테스트
```bash
# Android 개발 빌드
npx eas-cli build --platform android --profile development

# iOS 개발 빌드 (Mac 필요)
npx eas-cli build --platform ios --profile development
```

### Step 3: 프로덕션 빌드
```bash
# Android 프로덕션 빌드
npx eas-cli build --platform android --profile production

# iOS 프로덕션 빌드
npx eas-cli build --platform ios --profile production
```

### Step 4: 스토어 제출
- [ ] Google Play Console 설정
- [ ] App Store Connect 설정
- [ ] 스토어 리스팅 정보 작성
- [ ] 스크린샷 및 앱 설명 작성

---

## 🐛 알려진 이슈 및 해결 방법

### 1. Node.js 버전
- **현재:** v20.12.0
- **권장:** v20.19.4+
- **해결:** nvm으로 업그레이드 예정 ✅

### 2. 웹 지원 에러
- **문제:** `registerWebModule` 에러
- **상태:** 모바일 앱에서는 정상 작동
- **해결:** 웹 지원은 나중에 수정 가능

### 3. Android 권한 경고
- **문제:** `DETECT_SCREEN_CAPTURE` 권한 경고
- **상태:** 앱은 정상 작동 (경고만 표시)
- **해결:** `app.json`에 권한 설정 추가됨

---

## 📝 체크리스트 요약

### 즉시 해결 필요 (배포 전 필수)
1. ✅ Node.js 20.19.4 업그레이드 (진행 예정)
2. ❌ `.env` 파일 생성 및 프로덕션 환경 변수 설정
3. ❌ Assets 이미지 파일 추가
4. ❌ EAS Build 설정
5. ❌ 백엔드 서버 배포
6. ❌ Supabase 프로덕션 설정

### 배포 후 개선 가능
- 웹 지원 수정
- 성능 최적화
- 추가 테스트

---

## 💡 빠른 시작 가이드

1. **환경 변수 설정**
   ```bash
   cd frontend
   # .env 파일 생성 및 프로덕션 값 입력
   ```

2. **이미지 파일 추가**
   - `frontend/assets/` 폴더에 이미지 파일 추가
   - `app.json` 수정

3. **EAS 설정**
   ```bash
   npx eas-cli login
   npx eas-cli build:configure
   ```

4. **빌드 테스트**
   ```bash
   npx eas-cli build --platform android --profile development
   ```

---

**현재 상태:** 개발 환경에서 실행 가능 ✅  
**배포 준비:** 약 60% 완료  
**예상 배포 시간:** 모든 필수 항목 완료 후 1-2일

