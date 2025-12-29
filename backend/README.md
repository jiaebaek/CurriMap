# CurriMap Backend API

CurriMap 프로젝트의 Node.js + Express + Supabase 백엔드 API 서버입니다.

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+ 
- npm 또는 yarn
- Supabase 프로젝트 (데이터베이스 마이그레이션 완료)

### 설치

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 Supabase 정보 입력
```

### 환경 변수 설정

`.env` 파일에 다음 정보를 입력하세요:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
```

### 실행

```bash
# 개발 모드 (자동 재시작)
npm run dev

# 프로덕션 모드
npm start
```

서버가 `http://localhost:3000`에서 실행됩니다.

## 📚 API 엔드포인트

### 인증 (`/api/auth`)

- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보 조회

### 자녀 관리 (`/api/children`)

- `GET /api/children` - 자녀 목록 조회
- `GET /api/children/:childId` - 자녀 정보 조회
- `POST /api/children` - 자녀 프로필 생성
- `PUT /api/children/:childId` - 자녀 프로필 수정
- `POST /api/children/:childId/interests` - 관심사 태그 설정

### 온보딩 (`/api/onboarding`)

- `GET /api/onboarding/questions/:childId` - 연령별 온보딩 질문 조회
- `POST /api/onboarding/responses/:childId` - 온보딩 응답 저장
- `POST /api/onboarding/calculate-level/:childId` - 레벨 자동 계산 및 업데이트

### 도서 (`/api/books`)

- `GET /api/books/search` - 스마트 검색 (AR × Theme × Mood)
- `GET /api/books/:bookId` - 도서 상세 정보 조회
- `GET /api/books/daily/:childId` - 오늘의 미션 추천

### 미션 (`/api/missions`)

- `POST /api/missions/complete` - 미션 완료 및 기록 저장
- `GET /api/missions/:childId/history` - 미션 기록 이력 조회
- `GET /api/missions/:childId/stats` - 미션 통계 요약

### 로드맵 (`/api/roadmap`)

- `GET /api/roadmap/:childId` - 자녀의 현재 로드맵 조회
- `GET /api/roadmap/:childId/level/:levelId` - 특정 레벨의 도서 리스트 조회

### 리포트 (`/api/reports`)

- `GET /api/reports/:childId/monthly` - 월간 리포트 조회
- `GET /api/reports/:childId/summary` - 전체 성장 리포트 요약

### 관리자 (`/api/admin`)

- `GET /api/admin/books` - 도서 목록 조회
- `POST /api/admin/books` - 도서 등록
- `PUT /api/admin/books/:bookId` - 도서 수정
- `GET /api/admin/themes` - 주제 태그 목록
- `GET /api/admin/moods` - 분위기 태그 목록

## 🔐 인증

대부분의 API는 인증이 필요합니다. 요청 헤더에 다음을 포함하세요:

```
Authorization: Bearer <supabase_access_token>
```

비회원 접근 가능한 엔드포인트:
- `GET /api/books/search`
- `GET /api/books/:bookId`

## 📝 응답 형식

### 성공 응답

```json
{
  "data": { ... },
  "message": "Success message (optional)"
}
```

### 에러 응답

```json
{
  "error": "Error Name",
  "message": "Error message"
}
```

## 🛠️ 개발

### 프로젝트 구조

```
backend/
├── src/
│   ├── config/          # 설정 파일 (Supabase 등)
│   ├── middleware/      # 미들웨어 (인증, 에러 핸들링)
│   ├── routes/         # API 라우트
│   ├── utils/          # 유틸리티 함수
│   └── index.js        # 서버 진입점
├── .env.example        # 환경 변수 예시
├── package.json
└── README.md
```

### 주요 기능

1. **인증 미들웨어**: Supabase JWT 토큰 검증
2. **에러 핸들링**: 전역 에러 핸들러 및 404 핸들러
3. **유효성 검사**: express-validator를 사용한 입력 검증
4. **RLS 보안**: Supabase Row Level Security로 데이터 보호

## 🧪 테스트

```bash
# 테스트 실행 (추후 구현)
npm test
```

## 📦 배포

### 환경 변수 설정

프로덕션 환경에서는 다음 환경 변수를 설정하세요:

- `NODE_ENV=production`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CORS_ORIGIN` (프론트엔드 도메인)

### 배포 플랫폼

- **Vercel**: Serverless Functions로 배포
- **Railway**: 컨테이너 기반 배포
- **Heroku**: 전통적인 서버 배포
- **AWS/GCP**: 자체 인프라 배포

## 🐛 문제 해결

### "Admin client not configured" 에러

`.env` 파일에 `SUPABASE_SERVICE_ROLE_KEY`가 설정되어 있는지 확인하세요.

### 인증 오류

Supabase 프로젝트의 Authentication 설정을 확인하고, JWT 시크릿이 올바르게 설정되어 있는지 확인하세요.

### CORS 오류

`CORS_ORIGIN` 환경 변수가 프론트엔드 도메인과 일치하는지 확인하세요.

## 📞 문의

백엔드 API 관련 문의사항이 있으시면 프로젝트 관리자에게 연락하세요.

