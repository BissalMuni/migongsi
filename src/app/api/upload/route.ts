import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseXlsx } from "@/lib/xlsx-parser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    if (!file.name.endsWith(".xlsx")) {
      return NextResponse.json(
        { error: "xlsx 파일만 업로드 가능합니다." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { data: records, errors } = parseXlsx(buffer);

    if (errors.length > 0) {
      return NextResponse.json(
        { error: "엑셀 서식 오류", details: errors },
        { status: 400 }
      );
    }

    if (records.length === 0) {
      return NextResponse.json(
        { error: "파싱된 데이터가 없습니다." },
        { status: 400 }
      );
    }

    // Delete existing data and insert new
    await prisma.housing.deleteMany();

    // Insert in batches of 500
    const batchSize = 500;
    let inserted = 0;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      await prisma.housing.createMany({
        data: batch,
      });
      inserted += batch.length;
    }

    return NextResponse.json({
      message: `${inserted}건의 데이터가 저장되었습니다.`,
      count: inserted,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "업로드 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
