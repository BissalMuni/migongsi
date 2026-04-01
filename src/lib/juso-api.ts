const JUSO_API_URL = "https://business.juso.go.kr/addrlink/addrLinkApi.do";

// SQL reserved words to filter from search keywords
const SQL_KEYWORDS = [
  "OR", "SELECT", "INSERT", "DELETE", "UPDATE", "CREATE",
  "DROP", "EXEC", "UNION", "FETCH", "DECLARE", "TRUNCATE",
];

function sanitizeKeyword(keyword: string): string {
  // Remove special characters
  let sanitized = keyword.replace(/[%=><]/g, "");
  // Remove SQL reserved words
  for (const word of SQL_KEYWORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    sanitized = sanitized.replace(regex, "");
  }
  return sanitized.trim();
}

export interface JusoSearchParams {
  keyword: string;
  currentPage?: number;
  countPerPage?: number;
}

export interface JusoResult {
  roadAddr: string;
  roadAddrPart1: string;
  roadAddrPart2: string;
  jibunAddr: string;
  zipNo: string;
  siNm: string;
  sggNm: string;
  emdNm: string;
  rn: string;
  bdNm: string;
  bdKdcd: string;
}

export interface JusoResponse {
  results: {
    common: {
      totalCount: string;
      currentPage: number;
      countPerPage: number;
      errorCode: string;
      errorMessage: string;
    };
    juso: JusoResult[] | null;
  };
}

export async function searchJuso(params: JusoSearchParams): Promise<JusoResponse> {
  const apiKey = process.env.JUSO_API_KEY;

  if (!apiKey) {
    throw new Error("API 승인키가 설정되지 않았습니다. (JUSO_API_KEY)");
  }

  const sanitizedKeyword = sanitizeKeyword(params.keyword);
  if (!sanitizedKeyword || sanitizedKeyword.length < 2) {
    throw new Error("검색어를 두 글자 이상 입력해주세요.");
  }

  const searchParams = new URLSearchParams({
    confmKey: apiKey,
    currentPage: String(params.currentPage || 1),
    countPerPage: String(params.countPerPage || 10),
    keyword: sanitizedKeyword,
    resultType: "json",
  });

  const res = await fetch(`${JUSO_API_URL}?${searchParams.toString()}`);
  if (!res.ok) {
    throw new Error("도로명주소 API 호출에 실패했습니다.");
  }

  return res.json();
}
