"use client";

import { useState, useCallback, useEffect } from "react";
import SearchTabs from "@/components/SearchTabs";
import ResultTable from "@/components/ResultTable";
import Pagination from "@/components/Pagination";

interface HousingRow {
  id: number;
  baseDate: string;
  sido: string;
  sigungu: string;
  eupmyeondong: string;
  detailAddress: string;
  name: string;
  dong: string;
  ho: string;
  area: number;
  price: string;
  createdAt: string;
}

interface SearchResponse {
  data: HousingRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Home() {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});
  const [authenticated, setAuthenticated] = useState(false);
  const [authDong, setAuthDong] = useState("");
  const [authHo, setAuthHo] = useState("");
  const [authError, setAuthError] = useState("");

  // URL 파라미터에서 인증 결과 처리 + 세션 확인
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("authError");
    if (error) {
      setAuthError(error);
      sessionStorage.removeItem("pendingAuth");
      window.history.replaceState({}, "", "/");
      return;
    }

    const success = params.get("authSuccess");
    if (success) {
      const dong = params.get("dong") || "";
      const ho = params.get("ho") || "";
      setAuthenticated(true);
      setAuthDong(dong);
      setAuthHo(ho);
      sessionStorage.removeItem("pendingAuth");
      window.history.replaceState({}, "", "/");
      // 인증 성공 후 바로 해당 동/호 검색
      const query = new URLSearchParams({ dong, ho, page: "1" }).toString();
      setLoading(true);
      fetch(`/api/search?${query}`)
        .then((res) => res.json())
        .then((data) => { setResults(data); setSearchParams({ dong, ho, page: "1" }); })
        .catch(() => setResults(null))
        .finally(() => setLoading(false));
      return;
    }

    // pendingAuth가 있으면 인증 진행 중 (네이버에서 돌아오는 중)
    const pending = sessionStorage.getItem("pendingAuth");
    if (pending) {
      // 아직 authSuccess 파라미터가 없으면 대기 상태
      setLoading(true);
      return;
    }

    // 기존 세션 확인
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthenticated(true);
          setAuthDong(data.dong);
          setAuthHo(data.ho);
          const query = new URLSearchParams({ dong: data.dong, ho: data.ho, page: "1" }).toString();
          setLoading(true);
          fetch(`/api/search?${query}`)
            .then((res) => res.json())
            .then((d) => { setResults(d); setSearchParams({ dong: data.dong, ho: data.ho, page: "1" }); })
            .catch(() => setResults(null))
            .finally(() => setLoading(false));
        }
      })
      .catch(() => {});
  }, []);

  const doSearch = useCallback(async (params: Record<string, string>) => {
    setLoading(true);
    setSearchParams(params);
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`/api/search?${query}`);
      const data: SearchResponse = await res.json();
      setResults(data);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(
    (params: Record<string, string>) => {
      doSearch(params);
    },
    [doSearch]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      doSearch({ ...searchParams, page: String(page) });
    },
    [doSearch, searchParams]
  );

  return (
    <>
      {/* Title Box */}
      <div className="titlebox">
        {/* Breadcrumb */}
        <ul className="breadcrumb">
          <li>HOME</li>
          <li className="arrow">미공시 공동주택 공시가격열람</li>
          <li className="arrow">
            <strong>미공시 공동주택 공시가격 열람</strong>
          </li>
        </ul>

        {/* Title Area */}
        <div className="title-area">
          <div className="title-text">
            <h3>미공시 공동주택가격 열람</h3>
            <p className="year-info">2026년도 1.1 기준 공동주택가격(안)</p>
          </div>
          <svg
            className="title-img"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="10" y="25" width="25" height="35" rx="2" fill="#1a4899" opacity="0.15" />
            <rect x="40" y="15" width="30" height="45" rx="2" fill="#1a4899" opacity="0.2" />
            <rect x="15" y="32" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="23" y="32" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="15" y="40" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="23" y="40" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="15" y="48" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="23" y="48" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="46" y="22" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="54" y="22" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="62" y="22" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="46" y="30" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="54" y="30" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="62" y="30" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="46" y="38" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="54" y="38" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="62" y="38" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="46" y="46" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="54" y="46" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="62" y="46" width="5" height="5" rx="0.5" fill="#1a4899" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="content">
        {authError && (
          <div className="auth-error-banner">
            {authError}
            <button onClick={() => setAuthError("")} className="ml-3">&times;</button>
          </div>
        )}

        {authenticated && (
          <div className="auth-success-banner">
            본인인증 완료 ({authDong}동 {authHo}호)
          </div>
        )}

        {!authenticated && !loading && (
          <SearchTabs onSearch={handleSearch} authenticated={authenticated} authDong={authDong} authHo={authHo} />
        )}

        {results && results.data.length > 0 && (
          <div className="result-meta">
            <span className="result-meta-item">2026년 1.1기준 공동주택가격(안)</span>
            <span className="result-meta-item">
              열람지역 : <strong>{results.data[0].sido} {results.data[0].sigungu} {results.data[0].detailAddress}({results.data[0].sigungu} {results.data[0].eupmyeondong})</strong>
            </span>
          </div>
        )}

        <ResultTable
          data={results?.data || []}
          total={results?.total || 0}
          loading={loading}
        />

        {results && results.totalPages > 1 && (
          <Pagination
            currentPage={results.page}
            totalPages={results.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
}
