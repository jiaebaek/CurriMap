# CurriMap Frontend (React Native)

CurriMap 프로젝트의 React Native 모바일 앱입니다.

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+
- npm 또는 yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) 또는 Android Studio (Android)

### 설치

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 Supabase 및 API URL 입력
```

### 환경 변수 설정

`.env` 파일에 다음 정보를 입력하세요:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### 실행

```bash
# 개발 서버 시작
npm start

# iOS 시뮬레이터에서 실행
npm run ios

# Android 에뮬레이터에서 실행
npm run android

# 웹 브라우저에서 실행
npm run web
```

## 📱 주요 기능

### 인증
- 회원가입 / 로그인
- Supabase Auth 연동
- 자동 세션 관리

### 온보딩
- 자녀 프로필 생성
- 관심사 태그 선택 (3개 이상)
- 연령별 레벨 진단 질문
- 자동 레벨 계산 및 코스 배정

### 홈 화면
- 오늘의 미션 추천 (Rule-based 알고리즘)
- 통계 요약 (읽은 책, 연속 학습일, 누적 단어 수)
- 다른 책 기록하기 기능

### 검색
- 스마트 검색 (AR 레벨 × 주제 × 분위기)
- 필터 조합 검색
- 도서 상세 정보 조회

### 로드맵
- 현재 코스 진행 상황 시각화
- 과거/현재/미래 도서 구분
- 레벨별 도서 리스트

### 미션
- 미션 완료 및 아이 반응 기록
- 읽기/영상/듣기 활동 구분
- 회독 횟수 자동 추적

### 리포트
- 전체 성장 리포트 요약
- 월간 통계
- 시각화된 데이터

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── config/          # 설정 파일 (Supabase, API)
│   ├── context/         # Context API (AuthContext)
│   ├── navigation/      # 네비게이션 설정
│   ├── screens/         # 화면 컴포넌트
│   │   ├── Auth/
│   │   ├── Onboarding/
│   │   ├── Home/
│   │   ├── Search/
│   │   ├── Roadmap/
│   │   ├── MyPage/
│   │   ├── Book/
│   │   ├── Mission/
│   │   └── Report/
│   └── utils/           # 유틸리티 함수
├── App.js               # 앱 진입점
├── app.json            # Expo 설정
└── package.json
```

## 🎨 UI/UX 특징

- **따뜻한 디자인**: 엄마 타겟에 맞는 따뜻하고 친근한 색상
- **직관적인 네비게이션**: Bottom Tab Bar로 주요 기능 접근
- **반응형 레이아웃**: 다양한 화면 크기 지원
- **로딩 상태**: 사용자 경험을 위한 로딩 인디케이터

## 🔐 보안

- Supabase RLS로 데이터 보호
- JWT 토큰 기반 인증
- AsyncStorage로 세션 저장

## 📦 빌드 및 배포

### 개발 빌드

```bash
# iOS 개발 빌드
eas build --platform ios --profile development

# Android 개발 빌드
eas build --platform android --profile development
```

### 프로덕션 빌드

```bash
# iOS 프로덕션 빌드
eas build --platform ios --profile production

# Android 프로덕션 빌드
eas build --platform android --profile production
```

## 🐛 문제 해결

### "Missing Supabase environment variables" 에러

`.env` 파일이 올바르게 설정되어 있는지 확인하세요.

### 네비게이션 오류

`@react-navigation/native` 및 관련 패키지가 올바르게 설치되어 있는지 확인하세요.

### API 연결 오류

백엔드 서버가 실행 중인지, `EXPO_PUBLIC_API_URL`이 올바른지 확인하세요.

## 📞 문의

프론트엔드 관련 문의사항이 있으시면 프로젝트 관리자에게 연락하세요.

