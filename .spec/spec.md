# Specification

## User Roles
1. **Admin**: xlsx 파일을 업로드하여 DB에 데이터 적재
2. **Public**: 주소로 주택가격 의견 조회

## Features

### F1: 주택가격 의견 조회 (Public)
- As a 일반 사용자, I want to 주소를 입력하여 주택가격 의견을 조회 so that 해당 주택의 가격 정보를 확인할 수 있다
- Reference UI: realtyprice.kr의 개별주택가격 의견제출 조회 화면
- 검색 조건: 시/도, 시/군/구, 읍/면/동, 번지 등
- 결과: 주택가격 목록 테이블 표시

### F2: xlsx 파일 업로드 (Admin)
- As an 관리자, I want to xlsx 파일을 업로드 so that 주택가격 데이터를 DB에 적재할 수 있다
- 엑셀 서식: migongsi.xlsx 참조
- 업로드 후 데이터 파싱 및 DB 저장

### F3: 데이터 조회 API
- 프론트엔드에서 사용할 REST API
- 주소 기반 검색, 페이지네이션

## Success Criteria
- realtyprice.kr 참조 UI와 유사한 사용자 경험
- xlsx 업로드 시 데이터가 정상적으로 DB에 저장
- 주소 검색 시 정확한 결과 반환
