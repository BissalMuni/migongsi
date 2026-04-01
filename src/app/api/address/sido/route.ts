import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const results = await prisma.housing.findMany({
    select: { sido: true },
    distinct: ["sido"],
    orderBy: { sido: "asc" },
  });

  const options = results.map((r) => ({ value: r.sido, label: r.sido }));
  return NextResponse.json(options);
}
