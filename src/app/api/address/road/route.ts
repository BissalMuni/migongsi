import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const sido = request.nextUrl.searchParams.get("sido");
  const sigungu = request.nextUrl.searchParams.get("sigungu");
  if (!sido || !sigungu) {
    return NextResponse.json([]);
  }

  const results = await prisma.housing.findMany({
    where: {
      sido,
      sigungu,
      roadName: { not: null },
    },
    select: { roadName: true },
    distinct: ["roadName"],
    orderBy: { roadName: "asc" },
  });

  const options = results
    .filter((r) => r.roadName)
    .map((r) => ({ value: r.roadName!, label: r.roadName! }));
  return NextResponse.json(options);
}
