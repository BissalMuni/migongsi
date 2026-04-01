"use client";

interface HousingRow {
  id: number;
  baseDate: string;
  name: string;
  dong: string;
  ho: string;
  area: number;
  price: string;
  createdAt: string;
}

interface ResultTableProps {
  data: HousingRow[];
  total: number;
  loading: boolean;
}

function formatPrice(price: string): string {
  const num = BigInt(price);
  return num.toLocaleString("ko-KR");
}

function formatArea(area: number): string {
  return area.toFixed(2);
}

export default function ResultTable({ data, total, loading }: ResultTableProps) {
  if (loading) {
    return <div className="result-loading">검색 중...</div>;
  }

  return (
    <div style={{ marginTop: 20 }}>
      {/* Result count */}
      <div className="result-info">
        검색결과 : 총{" "}
        <span className="count">{total.toLocaleString()}</span>건
      </div>

      {/* Table */}
      <div className="result-table-wrap">
        <table className="result-table">
          <thead>
            <tr>
              <th>공시기준</th>
              <th>단지명</th>
              <th>동명</th>
              <th>호명</th>
              <th>전용면적(㎡)</th>
              <th>공동주택가격(원)</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-data">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  <td className="td-center">{row.baseDate}</td>
                  <td className="td-left">{row.name}</td>
                  <td className="td-center">{row.dong}</td>
                  <td className="td-center">{row.ho}</td>
                  <td className="td-right">{formatArea(row.area)}</td>
                  <td className="td-right">{formatPrice(row.price)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
