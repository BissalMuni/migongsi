import { NextRequest, NextResponse } from "next/server";
import { searchJuso } from "@/lib/juso-api";

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("keyword");
  const page = request.nextUrl.searchParams.get("page") || "1";
  const limit = request.nextUrl.searchParams.get("limit") || "10";

  if (!keyword) {
    return NextResponse.json(
      { error: "검색어를 입력해주세요." },
      { status: 400 }
    );
  }

  try {
    const result = await searchJuso({
      keyword,
      currentPage: parseInt(page, 10),
      countPerPage: parseInt(limit, 10),
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "도로명주소 검색 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
