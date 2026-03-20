# Plan

## Architecture
- Next.js App Router (Full-stack)
- API Routes for backend logic
- Server Components for data fetching
- Client Components for interactive UI

## Implementation Order

### Phase 1: Setup
- [ ] DB 설정 (schema, connection)
- [ ] xlsx 파싱 라이브러리 설치

### Phase 2: Core
- [ ] 데이터 모델 정의 (주택가격 테이블)
- [ ] xlsx 파싱 로직
- [ ] DB CRUD API

### Phase 3: Features
- [ ] Admin: xlsx 업로드 페이지
- [ ] Public: 주택가격 조회 페이지 (realtyprice.kr UI 참조)
- [ ] 주소 검색 기능

### Phase 4: Polish
- [ ] 에러 핸들링
- [ ] 반응형 디자인
- [ ] 접근성

## Dependencies
- TBD: xlsx parsing (e.g., xlsx, exceljs)
- TBD: Database ORM (e.g., Prisma, Drizzle)
