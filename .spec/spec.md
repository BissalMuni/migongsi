# Specification

## User Roles
1. **Admin**: xlsx 파일을 업로드하여 DB에 데이터 적재
2. **Public**: 주소로 주택가격 의견 조회

## Features

### F1: 주택가격 의견 조회 (Public)
- As a 일반 사용자, I want to 주소를 입력하여 주택가격 의견을 조회 so that 해당 주택의 가격 정보를 확인할 수 있다
- Reference UI: realtyprice.kr의 개별주택가격 의견제출 조회 화면
- 검색 탭 구성:
  - **도로명 검색 탭** (1차 구현): 엑셀 B열 소재지 기반 검색 (DB 자체 검색)
  - **지번 검색 탭** (UI만 선구현, API 연결은 추후): 도로명주소 API 연동 후 지번↔도로명 매핑 검색
- 검색 조건: 시/도, 시/군/구, 읍/면/동, 번지 등
- 결과: 주택가격 목록 테이블 표시

### F2: xlsx 파일 업로드 (Admin)
- As an 관리자, I want to xlsx 파일을 업로드 so that 주택가격 데이터를 DB에 적재할 수 있다
- 엑셀 서식: migongsi.xlsx 참조
- 업로드 후 데이터 파싱 및 DB 저장

#### 엑셀 컬럼 구조

| 컬럼 | 헤더 | 타입 | 비고 |
|------|------|------|------|
| A | 주택_일련번호 | number | PK |
| B | 소재지 | string | 주소 정규화 필요 |
| C | 명칭 | string | 건물/단지명 |
| D | 동 | string | 숫자/문자 혼합 → 문자열 처리 |
| E | 호 | string | 숫자/문자 혼합 → 문자열 처리 |
| F | 전용면적(m²) | number | 숫자/문자 혼합 → 숫자 변환 |
| G | 공시가격(원) | number | 숫자/문자 혼합 → 숫자 변환 (콤마 제거) |

#### 데이터 전처리 요구사항

1. **B열 주소 정규화**: 공백 구분 주소를 구조화된 필드로 분리
   - 예: `"서울 강남 삼성 영동대로128길 15"` → 시도: 서울, 시군구: 강남, 읍면동: 삼성, 상세주소: 영동대로128길 15
   - 검색 시 시도/시군구/읍면동 단위로 필터링 가능해야 함
2. **D·E열 (동/호)**: 셀 값을 문자열로 통일 (숫자 셀도 문자열 변환, 앞자리 0 보존)
3. **F열 (전용면적)**: 숫자로 변환 (소수점 유지)
4. **G열 (공시가격)**: 숫자로 변환 (콤마·공백 제거 후 정수 변환)

### F3: 도로명주소 API 연동 (⏳ API 승인키 발급 대기)
- 행정안전부 도로명주소 API (juso.go.kr) 연동
- 도로명주소 검색 시 매칭되는 지번주소 데이터를 함께 구축
- 엑셀 B열 소재지(지번 기반)와 도로명주소를 매핑하여 양방향 검색 가능
- 사용자가 도로명주소 또는 지번주소 어느 쪽으로든 검색 가능해야 함
- **구현 전략**:
  - 1차: 지번 검색 탭 UI + API 호출 코드 구조만 선구현 (confmKey 없이)
  - 2차: 승인키 발급 후 실제 API 연결

#### API 스펙 (도로명주소 검색 API)

- **요청 URL**: `https://business.juso.go.kr/addrlink/addrLinkApi.do` (xml/json)
- **호출 방식**: GET / POST

##### 요청 파라미터

| 변수명 | 타입 | 필수 | 기본값 | 설명 |
|--------|------|------|--------|------|
| confmKey | String | Y | - | 승인키 (business.juso.go.kr에서 발급) |
| currentPage | Integer | Y | 1 | 현재 페이지 번호 |
| countPerPage | Integer | Y | 10 | 페이지당 출력 Row 수 (max 100) |
| keyword | String | Y | - | 주소 검색어 |
| resultType | String | N | xml | 검색결과 형식 (xml, json) |
| hstryYn | String | N | N | 변동 주소정보 포함 여부 |
| firstSort | String | N | none | 우선정렬 (road: 도로명, location: 지번) |
| addInfoYn | String | N | N | 추가항목(hstryYn, relJibun, hemdNm) 제공여부 |

##### 응답 필드

**common (공통)**

| 필드명 | 타입 | 설명 |
|--------|------|------|
| totalCount | String | 총 검색 데이터수 |
| currentPage | Integer | 페이지 번호 |
| countPerPage | Integer | 페이지당 출력 Row 수 |
| errorCode | String | 에러 코드 (0: 정상) |
| errorMessage | String | 에러 메시지 |

**juso (주소 데이터)**

| 필드명 | 타입 | 설명 |
|--------|------|------|
| roadAddr | String | 전체 도로명주소 |
| roadAddrPart1 | String | 도로명주소 (참고항목 제외) |
| roadAddrPart2 | String | 도로명주소 참고항목 |
| jibunAddr | String | 지번주소 |
| engAddr | String | 도로명주소 (영문) |
| zipNo | String | 우편번호 |
| admCd | String | 행정구역코드 |
| rnMgtSn | String | 도로명코드 |
| bdMgtSn | String | 건물관리번호 |
| detBdNmList | String | 상세건물명 |
| bdNm | String | 건물명 |
| bdKdcd | String | 공동주택여부 (1: 공동주택, 0: 비공동주택) |
| siNm | String | 시도명 |
| sggNm | String | 시군구명 |
| emdNm | String | 읍면동명 |
| liNm | String | 법정리명 |
| rn | String | 도로명 |
| udrtYn | String | 지하여부 (0: 지상, 1: 지하) |
| buldMnnm | Number | 건물본번 |
| buldSlno | Number | 건물부번 |
| mtYn | String | 산여부 (0: 대지, 1: 산) |
| lnbrMnnm | Number | 지번본번 (번지) |
| lnbrSlno | Number | 지번부번 (호) |
| emdNo | String | 읍면동일련번호 |
| hstryYn | String | 변동이력여부 (addInfoYn=Y 시) |
| relJibun | String | 관련지번 (addInfoYn=Y 시) |
| hemdNm | String | 관할주민센터 (addInfoYn=Y 시) |

##### 주요 에러코드

| 코드 | 메시지 | 조치 |
|------|--------|------|
| 0 | 정상 | - |
| E0001 | 승인되지 않은 KEY | 정확한 승인키 입력 |
| E0005 | 검색어 미입력 | 검색어 입력 필요 |
| E0006 | 주소를 상세히 입력 | 시도명만으로 검색 불가 |
| E0008 | 두 글자 이상 입력 필요 | 한 글자 검색 불가 |
| E0015 | 검색 범위 초과 | 결과 9천건 초과 시 불가 |

##### 검색어 필터링 (보안)
- 특수문자 `%`, `=`, `>`, `<` 제거 필수
- SQL 예약어 (OR, SELECT, INSERT, DELETE, UPDATE, CREATE, DROP, EXEC, UNION, FETCH, DECLARE, TRUNCATE) 필터링 필수
- 미적용 시 보안장비가 IP 차단할 수 있음

### F4: 데이터 조회 API
- 프론트엔드에서 사용할 REST API
- 주소 기반 검색 (도로명/지번 모두 지원), 페이지네이션

## Success Criteria
- realtyprice.kr 참조 UI와 유사한 사용자 경험
- xlsx 업로드 시 데이터가 정상적으로 DB에 저장
- 주소 검색 시 정확한 결과 반환
