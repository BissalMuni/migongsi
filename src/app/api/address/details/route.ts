import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const sido = request.nextUrl.searchParams.get("sido");
  const sigungu = request.nextUrl.searchParams.get("sigungu");
  const roadName = request.nextUrl.searchParams.get("roadName");
  const name = request.nextUrl.searchParams.get("name");
  const dong = request.nextUrl.searchParams.get("dong");
  if (!sido || !sigungu || !roadName) {
    return NextResponse.json({ names: [], dongs: [], hos: [] });
  }

  const baseWhere = { sido, sigungu, roadName };

  // 단지명: dong 필터만 적용
  const nameWhere = { ...baseWhere, ...(dong ? { dong } : {}) };
  // 동: name 필터만 적용
  const dongWhere = { ...baseWhere, ...(name ? { name } : {}) };
  // 호: name + dong 필터 적용
  const hoWhere = { ...baseWhere, ...(name ? { name } : {}), ...(dong ? { dong } : {}) };

  const [nameRows, dongRows, hoRows] = await Promise.all([
    prisma.housing.findMany({
      where: nameWhere,
      select: { name: true },
      distinct: ["name"],
      orderBy: { name: "asc" },
    }),
    prisma.housing.findMany({
      where: dongWhere,
      select: { dong: true },
      distinct: ["dong"],
      orderBy: { dong: "asc" },
    }),
    prisma.housing.findMany({
      where: hoWhere,
      select: { ho: true },
      distinct: ["ho"],
      orderBy: { ho: "asc" },
    }),
  ]);

  return NextResponse.json({
    names: nameRows.map((r) => r.name),
    dongs: dongRows.map((r) => r.dong).sort((a, b) =>
      a.localeCompare(b, "ko", { numeric: true })
    ),
    hos: hoRows.map((r) => r.ho).sort((a, b) =>
      a.localeCompare(b, "ko", { numeric: true })
    ),
  }, {
    headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=360" },
  });
}
