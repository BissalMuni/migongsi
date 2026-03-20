# Constitution

## Project Overview
- **Name**: migongsi
- **Description**: 부동산 주택가격 의견 조회 시스템 (xlsx 업로드 + 주소별 주택가격 조회)
- **Reference UI**: https://www.realtyprice.kr/notice/town/searchOpinion.htm

## Tech Stack
- **Framework**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm
- **Testing**: vitest
- **Database**: TBD (SQLite / PostgreSQL)
- **File Processing**: xlsx parsing library

## Coding Conventions
- Language: TypeScript (strict mode)
- Naming: camelCase for variables/functions, PascalCase for components/types
- File structure: src/ directory with App Router conventions
- Import alias: @/*

## Non-Functional Requirements
- 한국어 UI (Korean language interface)
- Responsive design
- Secure file upload (xlsx only)
- Role-based access: admin (xlsx upload) / public (search)
