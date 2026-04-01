export interface HousingRecord {
  id: number;
  serialNo: number;
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
  roadAddr: string | null;
  jibunAddr: string | null;
  zipNo: string | null;
  createdAt: Date;
}

export interface SearchParams {
  sido?: string;
  sigungu?: string;
  eupmyeondong?: string;
  roadName?: string;
  name?: string;
  dong?: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  data: HousingRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AddressOption {
  value: string;
  label: string;
}
