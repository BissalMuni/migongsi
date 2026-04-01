# Tasks

## Phase 1: Setup (인프라)

- [x] [T001] Prisma + SQLite 설치 및 초기화 (`pnpm add prisma @prisma/client`, `npx prisma init --datasource-provider sqlite`)
- [x] [T002] DB 스키마 정의 (`prisma/schema.prisma` — Housing 모델, 인덱스)
- [x] [T003] Prisma 마이그레이션 실행 (`npx prisma migrate dev --name init`)
- [x] [T004] Prisma Client 싱글턴 생성 (`src/lib/prisma.ts`)
- [x] [T005] xlsx 라이브러리 설치 (`pnpm add xlsx`)
- [x] [T006] 공통 타입 정의 (`src/types/index.ts`)
- [x] [T007] 환경 변수 설정 (`.env` — DATABASE_URL, JUSO_API_KEY)

## Phase 2: Core (데이터 처리)

- [x] [T008] xlsx 파싱 + 주소 정규화 유틸 구현 (`src/lib/xlsx-parser.ts`)
  - 엑셀 읽기, B열 주소 split(시도/시군구/읍면동/상세주소), D·E 문자열 변환, F·G 숫자 변환
- [x] [T009] 업로드 API Route 구현 (`src/app/api/upload/route.ts`)
  - POST: multipart/form-data로 xlsx 수신 → 파싱 → DB 일괄 저장
- [x] [T010] Admin 업로드 페이지 구현 (`src/app/admin/upload/page.tsx`)
  - 파일 선택, 업로드 버튼, 진행 상태 표시, 결과 메시지
- [x] [T011] FileUpload 컴포넌트 구현 (`src/components/FileUpload.tsx`)

## Phase 3: Features (검색 기능)

### 3-1: API Routes

- [x] [T012] 시도 목록 API (`src/app/api/address/sido/route.ts`) — DB에서 DISTINCT sido 조회
- [x] [T013] 시군구 목록 API (`src/app/api/address/sigungu/route.ts`) — ?sido= 파라미터
- [x] [T014] 읍면동 목록 API (`src/app/api/address/eupmyeondong/route.ts`) — ?sido=&sigungu=
- [x] [T015] 도로명 목록 API (`src/app/api/address/road/route.ts`) — ?sido=&sigungu=&dong=
- [x] [T016] 주택가격 검색 API (`src/app/api/search/route.ts`)
  - GET: sido, sigungu, dong, roadName, name, dong(건물동), page, limit
  - 결과: { data: Housing[], total: number, page: number }

### 3-2: UI 컴포넌트

- [x] [T017] Header 컴포넌트 (`src/components/Header.tsx`)
  - 파란색 배경, "부동산 공시가격 알리미" 로고, 네비게이션 메뉴
- [x] [T018] Sidebar 컴포넌트 (`src/components/Sidebar.tsx`)
  - 좌측 메뉴: 공동주택/표준주택/개별주택, 연락처
- [x] [T019] 루트 레이아웃 수정 (`src/app/layout.tsx`)
  - Header + Sidebar + main content 영역 구성
- [x] [T020] CascadeSelect 컴포넌트 (`src/components/CascadeSelect.tsx`)
  - 연쇄 셀렉트박스: 상위 선택 시 하위 목록 fetch
- [x] [T021] SearchTabs 컴포넌트 (`src/components/SearchTabs.tsx`)
  - 도로명/지번 탭 전환 UI
- [x] [T022] RoadNameSearch 컴포넌트 (`src/components/RoadNameSearch.tsx`)
  - 시도→시군구→도로명 캐스케이드, 단지명/건물번호 라디오, 검색 버튼
- [x] [T023] JibunSearch 컴포넌트 (`src/components/JibunSearch.tsx`)
  - 시도→시군구→읍면동 캐스케이드, 단지명/지번 라디오, 검색 버튼
  - API 연결 없이 UI만 구현, "API 승인키 발급 후 연결 예정" 안내 표시
- [x] [T024] ResultTable 컴포넌트 (`src/components/ResultTable.tsx`)
  - 컬럼: 공시기준 | 단지명 | 동명 | 호명 | 전용면적(㎡) | 공동주택가격(원)
  - 가격 콤마 포맷, 면적 소수점 2자리
- [x] [T025] Pagination 컴포넌트 (`src/components/Pagination.tsx`)
  - ◁ 1 2 3 4 5 ▷ 형태, 페이지 블록 단위 이동
- [x] [T026] 메인 페이지 조립 (`src/app/page.tsx`)
  - SearchTabs + ResultTable + Pagination 통합

## Phase 4: Polish

- [x] [T027] 에러 핸들링 — 빈 결과 안내, 업로드 실패 처리, API 오류 메시지
- [x] [T028] 도로명주소 API 프록시 구조 선구현
  - `src/lib/juso-api.ts` — API 클라이언트 (confmKey 미설정 시 에러 반환)
  - `src/app/api/juso/route.ts` — 프록시 Route (검색어 필터링 포함)
- [x] [T029] 반응형 디자인 — 모바일/태블릿 대응
- [x] [T030] .gitignore 확인 — .env, prisma/dev.db, node_modules 포함

## 요약

- 총 작업: 30개
- Phase 1 (Setup): 7개
- Phase 2 (Core): 4개
- Phase 3 (Features): 15개
- Phase 4 (Polish): 4개
