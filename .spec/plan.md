# Plan

## Architecture

```
Next.js App Router (Full-stack)
├── Frontend: React Server/Client Components + Tailwind CSS
├── Backend: Next.js API Routes (Route Handlers)
├── Database: SQLite (via Prisma ORM) — 별도 DB 서버 불필요
└── File Processing: xlsx 라이브러리로 엑셀 파싱
```

## 기술 스택 확정

| 역할 | 선택 | 근거 |
|------|------|------|
| ORM | Prisma | 타입 안전, 마이그레이션 관리, SQLite 지원 |
| DB | SQLite | 단일 파일 DB, 배포 간편, 소규모 데이터에 적합 |
| xlsx 파싱 | xlsx (SheetJS) | 가볍고 빠름, 셀 타입 감지 가능 |
| UI 스타일 | Tailwind CSS | Next.js 기본 포함, 유틸리티 기반 빠른 스타일링 |

## 파일 구조

```
src/
├── app/
│   ├── layout.tsx                    # 루트 레이아웃 (헤더, 사이드바)
│   ├── page.tsx                      # 메인 검색 페이지
│   ├── admin/
│   │   └── upload/
│   │       └── page.tsx              # Admin xlsx 업로드 페이지
│   └── api/
│       ├── address/
│       │   ├── sido/route.ts         # GET 시도 목록
│       │   ├── sigungu/route.ts      # GET 시군구 목록 (?sido=)
│       │   ├── eupmyeondong/route.ts # GET 읍면동 목록 (?sido=&sigungu=)
│       │   └── road/route.ts         # GET 도로명 목록 (?sido=&sigungu=&dong=)
│       ├── search/route.ts           # GET 주택가격 검색 (도로명/지번)
│       ├── upload/route.ts           # POST xlsx 업로드 + 파싱 + DB 저장
│       └── juso/route.ts             # GET 도로명주소 API 프록시 (2차 구현)
├── components/
│   ├── Header.tsx                    # 상단 헤더 (부동산 공시가격 알리미)
│   ├── Sidebar.tsx                   # 좌측 사이드바 메뉴
│   ├── SearchTabs.tsx                # 도로명/지번 탭 컨테이너
│   ├── RoadNameSearch.tsx            # 도로명 검색 폼
│   ├── JibunSearch.tsx               # 지번 검색 폼 (UI만 선구현)
│   ├── CascadeSelect.tsx             # 연쇄 셀렉트박스 공통 컴포넌트
│   ├── ResultTable.tsx               # 검색 결과 테이블
│   ├── Pagination.tsx                # 페이지네이션
│   └── FileUpload.tsx                # xlsx 업로드 컴포넌트
├── lib/
│   ├── prisma.ts                     # Prisma Client 싱글턴
│   ├── xlsx-parser.ts                # xlsx 파싱 + 주소 정규화 로직
│   └── juso-api.ts                   # 도로명주소 API 클라이언트 (2차 구현)
└── types/
    └── index.ts                      # 공통 타입 정의

prisma/
├── schema.prisma                     # DB 스키마
└── dev.db                            # SQLite DB 파일 (gitignore)
```

## DB 스키마

```prisma
model Housing {
  id            Int      @id @default(autoincrement())
  serialNo      Int      // 주택_일련번호 (엑셀 A열)

  // 주소 정규화 필드 (엑셀 B열 파싱)
  sido          String   // 시도 (예: 서울)
  sigungu       String   // 시군구 (예: 강남)
  eupmyeondong  String   // 읍면동 (예: 삼성)
  detailAddress String   // 상세주소 (예: 영동대로128길 15)
  roadName      String?  // 도로명 (상세주소에서 추출)

  // 건물 정보
  name          String   // 명칭 (엑셀 C열)
  dong          String   // 동 (엑셀 D열)
  ho            String   // 호 (엑셀 E열)
  area          Float    // 전용면적 m² (엑셀 F열)
  price         BigInt   // 공시가격 원 (엑셀 G열)

  // 도로명주소 API 매핑 (2차 구현)
  roadAddr      String?  // 전체 도로명주소
  jibunAddr     String?  // 지번주소
  zipNo         String?  // 우편번호

  createdAt     DateTime @default(now())

  @@index([sido, sigungu, eupmyeondong])
  @@index([name])
  @@index([roadName])
}
```

## 주소 정규화 로직

엑셀 B열 `"서울 강남 삼성 영동대로128길 15"` 파싱 규칙:
1. 공백으로 split
2. 1번째 토큰 → sido (시도)
3. 2번째 토큰 → sigungu (시군구)
4. 3번째 토큰 → eupmyeondong (읍면동)
5. 나머지 → detailAddress (상세주소)
6. 상세주소에서 `~로`, `~길`, `~대로` 패턴 → roadName 추출

## UI 구현 상세

### 메인 레이아웃 (realtyprice.kr 클론)
- **헤더**: 파란색 배경, "부동산 공시가격 알리미" 로고, 네비게이션
- **사이드바**: 좌측 메뉴 (공동주택/표준주택/개별주택 등)
- **콘텐츠**: 검색 탭 + 결과 테이블

### 도로명 검색 탭 (1차 구현)
```
[시도 ▼] [시군구 ▼] [초성검색 ▼] [도로명 ▼]
○ 단지명 입력 [___________]  ○ 건물번호 입력 [본번]-[부번]
[단지/동/호 ▼]
                                              [검색]
```
- 시도 → 시군구 → 도로명: 연쇄 셀렉트박스 (이전 선택에 따라 다음 목록 필터)
- 검색 유형: 라디오 (단지명 입력 / 건물번호 입력)

### 지번 검색 탭 (UI만 선구현)
```
[시도 ▼] [시군구 ▼] [읍면동 ▼]
○ 단지명 입력 [___________]  ○ 지번 입력 [본번]-[부번]
[단지/동/호 ▼]
                                              [검색]
```

### 결과 테이블
```
| 공시기준 | 단지명 | 동명 | 호명 | 전용면적(㎡) | 공동주택가격(원) |
```
- 페이지네이션: ◁ 1 2 3 4 5 ▷
- 가격: 천 단위 콤마 포맷
- 면적: 소수점 2자리

## 의존성 목록

```json
{
  "dependencies": {
    "prisma": "^6",
    "@prisma/client": "^6",
    "xlsx": "^0.18"
  }
}
```

## 구현 순서

### Phase 1: Setup (인프라)
1. Prisma + SQLite 설정, 스키마 정의, 마이그레이션
2. xlsx 라이브러리 설치
3. Prisma Client 싱글턴 설정

### Phase 2: Core (데이터)
4. xlsx 파싱 + 주소 정규화 유틸 구현
5. 업로드 API Route 구현 (POST /api/upload)
6. Admin 업로드 페이지 구현
7. migongsi.xlsx 시드 데이터 적재 테스트

### Phase 3: Features (검색 UI)
8. 주소 캐스케이드 API Routes 구현 (sido/sigungu/eupmyeondong/road)
9. 검색 API Route 구현 (GET /api/search + 페이지네이션)
10. 레이아웃 컴포넌트 (Header, Sidebar)
11. 도로명 검색 탭 컴포넌트 (CascadeSelect + 검색 폼)
12. 지번 검색 탭 컴포넌트 (UI만)
13. 결과 테이블 + 페이지네이션 컴포넌트
14. 메인 페이지 조립

### Phase 4: Polish
15. 에러 핸들링 (빈 결과, API 오류)
16. 도로명주소 API 프록시 Route 구조 (juso-api.ts + /api/juso)
17. 반응형 디자인 조정

## 환경 변수

```env
DATABASE_URL="file:./dev.db"
JUSO_API_KEY=""  # 2차 구현 시 입력
```
