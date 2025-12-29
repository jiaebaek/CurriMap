# CurriMap (커리맵)

엄마표 영어 학습을 돕는 **개인화 맞춤 로드맵 & 원서 큐레이션 플랫폼**

## 📋 프로젝트 개요

CurriMap은 영유아~초등 자녀를 둔 부모(특히 엄마)를 대상으로, 자녀의 수준(AR/Lexile)과 취향(관심사/분위기)을 기반으로 원서를 추천하고, 독서 기록을 체계적으로 관리하는 모바일 앱입니다.

### 핵심 가치

- **Customization**: 아이의 관심사와 레벨을 정밀하게 분석
- **Roadmap**: 흔들리지 않는 장기적 가이드라인 제공
- **Consistency**: 엄마가 지치지 않도록 돕는 시스템

## 🏗️ 프로젝트 구조

```
CurriMap/
├── database/           # 데이터베이스 스키마 및 마이그레이션
│   ├── migrations/     # 테이블 생성 마이그레이션
│   ├── functions/      # PostgreSQL 함수 및 트리거
│   └── seeds/          # 시드 데이터
├── backend/            # Node.js + Express + Supabase 백엔드 API
│   ├── src/
│   │   ├── config/     # Supabase 설정
│   │   ├── middleware/ # 인증, 에러 핸들링
│   │   ├── routes/     # API 라우트
│   │   └── utils/      # 유틸리티 함수
│   └── package.json
├── frontend/           # React Native 모바일 앱 (Expo)
│   ├── src/
│   │   ├── config/     # Supabase, API 설정
│   │   ├── context/    # AuthContext
│   │   ├── navigation/ # 네비게이션 설정
│   │   └── screens/    # 화면 컴포넌트
│   └── package.json
└── doc/                # 프로젝트 문서
    ├── ERD             # 데이터베이스 ERD
    ├── PRD             # 제품 요구사항 정의서
    └── ...
```

## 🚀 빠른 시작

### 1. 데이터베이스 설정

```bash
cd database
# Supabase Dashboard에서 마이그레이션 파일 순서대로 실행
# 또는 MIGRATION_GUIDE.md 참고
```

### 2. 백엔드 설정

```bash
cd backend
npm install
cp .env.example .env
# .env 파일에 Supabase 정보 입력
npm run dev
```

### 3. 프론트엔드 설정

```bash
cd frontend
npm install
cp .env.example .env
# .env 파일에 Supabase 및 API URL 입력
npm start
```

## 📚 주요 기능

### MVP 기능 (1차 출시)

- ✅ **온보딩**: 자녀 프로필 생성, 관심사 태그 선택, 연령별 레벨 진단
- ✅ **오늘의 미션**: Rule-based 알고리즘으로 매일 1권 추천
- ✅ **스마트 검색**: AR 레벨 × 주제 × 분위기 교차 필터링
- ✅ **미션 완료**: 읽기/영상/듣기 활동 기록 및 아이 반응 저장
- ✅ **로드맵 시각화**: 현재 코스 진행 상황 및 도서 리스트
- ✅ **리포트**: 월간 통계 및 전체 성장 리포트
- ✅ **Admin CMS**: 도서 등록/수정 (관리자 웹)

## 🛠️ 기술 스택

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth (JWT)

### Frontend
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **State Management**: Context API
- **API Client**: Supabase JS Client

### Database
- **DBMS**: PostgreSQL 15+
- **ORM**: Supabase Client (PostgREST)
- **Migration**: SQL 파일 기반

## 📖 문서

- [데이터베이스 README](./database/README.md)
- [마이그레이션 가이드](./database/MIGRATION_GUIDE.md)
- [백엔드 README](./backend/README.md)
- [프론트엔드 README](./frontend/README.md)
- [ERD 문서](./doc/ERD)

## 🔐 환경 변수

### Backend (.env)
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
```

### Frontend (.env)
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

## 📱 화면 구성

### Bottom Tab Navigation
1. **홈**: 오늘의 미션, 통계 요약
2. **로드맵**: 코스 진행 상황 시각화
3. **검색**: 스마트 검색 및 도서 조회
4. **마이페이지**: 리포트, 설정, 로그아웃

### 주요 플로우
- **온보딩 플로우**: 회원가입 → 자녀 프로필 → 관심사 선택 → 레벨 진단 → 홈
- **미션 플로우**: 홈 → 도서 상세 → 미션 시작 → 완료 및 반응 기록
- **검색 플로우**: 검색 화면 → 필터 설정 → 결과 조회 → 도서 상세

## 🧪 테스트

```bash
# 백엔드 테스트 (추후 구현)
cd backend
npm test

# 프론트엔드 테스트 (추후 구현)
cd frontend
npm test
```

## 📦 배포

### 데이터베이스
- Supabase 프로덕션 환경에 마이그레이션 실행

### 백엔드
- Vercel, Railway, Heroku 등에 배포
- 환경 변수 설정 필수

### 프론트엔드
- Expo EAS Build로 iOS/Android 빌드
- App Store / Play Store 제출

## 🤝 기여

프로젝트 기여를 원하시면 이슈를 생성하거나 Pull Request를 제출해주세요.

## 📄 라이선스

이 프로젝트는 비공개 프로젝트입니다.

## 📞 문의

프로젝트 관련 문의사항이 있으시면 프로젝트 관리자에게 연락하세요.

---

**CurriMap** - 영어유치원보다 든든한, 내 아이 맞춤형 영어 큐레이터

