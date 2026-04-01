import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const sido = request.nextUrl.searchParams.get("sido");
  if (!sido) {
    return NextResponse.json([]);
  }

  const results = await prisma.housing.findMany({
    where: { sido },
    select: { sigungu: true },
    distinct: ["sigungu"],
    orderBy: { sigungu: "asc" },
  });

  const options = results.map((r) => ({ value: r.sigungu, label: r.sigungu }));
  return NextResponse.json(options, {
    headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=360" },
  });
}
