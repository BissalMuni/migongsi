import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  const headers = [
    "주택_일련번호",
    "소재지",
    "명칭",
    "동",
    "호",
    "전용면적(㎡)",
    "공시가격(원)",
    "공시기준",
  ];

  const sampleRow = [
    1,
    "서울 강남 삼성 영동대로128길 15",
    "아크로삼성",
    "101",
    "201",
    "104.9",
    "3092000000",
    "20260101",
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow]);

  // 컬럼 너비 설정
  ws["!cols"] = [
    { wch: 14 },
    { wch: 35 },
    { wch: 20 },
    { wch: 8 },
    { wch: 8 },
    { wch: 14 },
    { wch: 16 },
    { wch: 12 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "데이터");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        'attachment; filename="migongsi_template.xlsx"',
    },
  });
}
