import * as XLSX from "xlsx";
import { createHash } from "crypto";

export interface ParsedHousing {
  serialNo: number;
  baseDate: string;
  sido: string;
  sigungu: string;
  eupmyeondong: string;
  detailAddress: string;
  roadName: string | null;
  name: string;
  dong: string;
  ho: string;
  area: number;
  price: bigint;
  ownerHash: string | null;
}

// 필수 헤더 (순서대로)
const REQUIRED_HEADERS = [
  "주택_일련번호",
  "소재지",
  "명칭",
  "동",
  "호",
  "전용면적",
  "공시가격",
  "공시기준",
  "이름",
  "생년월일",
];

function hashOwner(name: string, birthDate: string): string | null {
  const trimmedName = name.trim();
  const trimmedBirth = birthDate.trim().replace(/[.\-/\s]/g, "");
  if (!trimmedName || !trimmedBirth) return null;
  return createHash("sha256").update(trimmedName + trimmedBirth, "utf8").digest("hex");
}

export interface ParseResult {
  data: ParsedHousing[];
  errors: string[];
}

function extractRoadName(detail: string): string | null {
  const match = detail.match(/\S*(로|길|대로)\S*/);
  return match ? match[0] : null;
}

function parseAddress(address: string) {
  const parts = address.split(/\s+/).filter(Boolean);
  const sido = parts[0] || "";
  const sigungu = parts[1] || "";
  const eupmyeondong = parts[2] || "";
  const detailAddress = parts.slice(3).join(" ");
  const roadName = extractRoadName(detailAddress);
  return { sido, sigungu, eupmyeondong, detailAddress, roadName };
}

function toString(val: unknown): string {
  if (val === null || val === undefined) return "";
  return String(val);
}

function toFloat(val: unknown): number {
  if (typeof val === "number") return val;
  const str = toString(val).replace(/[,\s]/g, "");
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

function toBigInt(val: unknown): bigint {
  if (typeof val === "number") return BigInt(Math.round(val));
  const str = toString(val).replace(/[,\s]/g, "");
  const num = parseInt(str, 10);
  return isNaN(num) ? BigInt(0) : BigInt(num);
}

function normalizeDate(val: string): string {
  if (!val) return "";
  const cleaned = val.replace(/[.\-/\s]/g, "");
  // 20260101 → 2026.1.1
  if (/^\d{8}$/.test(cleaned)) {
    const y = parseInt(cleaned.slice(0, 4), 10);
    const m = parseInt(cleaned.slice(4, 6), 10);
    const d = parseInt(cleaned.slice(6, 8), 10);
    return `${y}.${m}.${d}`;
  }
  // 이미 2026.1.1 등의 형식이면 정규화
  const parts = val.split(/[.\-/]/);
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return `${y}.${m}.${d}`;
    }
  }
  return val;
}

function validateHeaders(headerRow: unknown[]): string[] {
  const errors: string[] = [];
  const headers = headerRow.map((h) =>
    toString(h).replace(/[\s()（）㎡²원]/g, "")
  );

  for (const required of REQUIRED_HEADERS) {
    const normalized = required.replace(/[\s()（）㎡²원]/g, "");
    const found = headers.some((h) => h.includes(normalized));
    if (!found) {
      errors.push(`필수 필드 "${required}" 누락`);
    }
  }
  return errors;
}

export function parseXlsx(buffer: Buffer): ParseResult {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    raw: true,
    defval: "",
  });

  if (rows.length === 0) {
    return { data: [], errors: ["빈 파일입니다."] };
  }

  // 헤더 검증
  const headerErrors = validateHeaders(rows[0] as unknown[]);
  if (headerErrors.length > 0) {
    return { data: [], errors: headerErrors };
  }

  const dataRows = rows.slice(1);
  const results: ParsedHousing[] = [];

  for (const row of dataRows) {
    const r = row as unknown[];
    if (!r[0] && !r[1]) continue;

    const serialNo =
      typeof r[0] === "number" ? r[0] : parseInt(toString(r[0]), 10) || 0;
    const { sido, sigungu, eupmyeondong, detailAddress, roadName } =
      parseAddress(toString(r[1]));
    const name = toString(r[2]);
    const dong = toString(r[3]).replace(/^0+/, "") || "0";
    const ho = toString(r[4]).replace(/^0+/, "") || "0";
    const area = toFloat(r[5]);
    const price = toBigInt(r[6]);
    const baseDate = normalizeDate(toString(r[7]));
    const ownerName = toString(r[8]);
    const birthDate = toString(r[9]);
    const ownerHash = hashOwner(ownerName, birthDate);

    results.push({
      serialNo,
      baseDate,
      sido,
      sigungu,
      eupmyeondong,
      detailAddress,
      roadName,
      name,
      dong,
      ho,
      area,
      price,
      ownerHash,
    });
  }

  return { data: results, errors: [] };
}
