import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const sido = params.get("sido");
  const sigungu = params.get("sigungu");
  const eupmyeondong = params.get("eupmyeondong");
  const roadName = params.get("roadName");
  const name = params.get("name");
  const buildingDong = params.get("dong");
  const ho = params.get("ho");
  const mainNo = params.get("mainNo");
  const subNo = params.get("subNo");
  const page = Math.max(1, parseInt(params.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(params.get("limit") || "10", 10)));

  const where: Record<string, unknown> = {};

  if (sido) where.sido = sido;
  if (sigungu) where.sigungu = sigungu;
  if (eupmyeondong) where.eupmyeondong = eupmyeondong;
  if (roadName) where.roadName = roadName;
  if (name) where.name = name;
  if (buildingDong) where.dong = buildingDong;
  if (ho) where.ho = ho;

  if (mainNo) {
    where.detailAddress = { contains: mainNo + (subNo ? `-${subNo}` : "") };
  }

  const [data, total] = await Promise.all([
    prisma.housing.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ name: "asc" }, { dong: "asc" }, { ho: "asc" }],
    }),
    prisma.housing.count({ where }),
  ]);

  // Serialize BigInt to string for JSON
  const serialized = data.map((item) => ({
    ...item,
    price: item.price.toString(),
  }));

  return NextResponse.json({
    data: serialized,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
