import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const sido = request.nextUrl.searchParams.get("sido");
  const sigungu = request.nextUrl.searchParams.get("sigungu");
  if (!sido || !sigungu) {
    return NextResponse.json([]);
  }

  const results = await prisma.housing.findMany({
    where: { sido, sigungu },
    select: { eupmyeondong: true },
    distinct: ["eupmyeondong"],
    orderBy: { eupmyeondong: "asc" },
  });

  const options = results.map((r) => ({
    value: r.eupmyeondong,
    label: r.eupmyeondong,
  }));
  return NextResponse.json(options);
}
