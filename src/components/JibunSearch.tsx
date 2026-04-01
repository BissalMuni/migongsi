"use client";

import { useState } from "react";
import ListSelect from "./ListSelect";

export default function JibunSearch() {
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [dong, setDong] = useState("");
  const [searchType, setSearchType] = useState<"name" | "jibun">("name");

  return (
    <div>
      {/* List boxes row */}
      <div className="list-select-row">
        <ListSelect
          label="시/도 선택"
          value={sido}
          onChange={(v) => {
            setSido(v);
            setSigungu("");
            setDong("");
          }}
          fetchUrl="/api/address/sido"
        />
        <ListSelect
          label="시/군/구 선택"
          value={sigungu}
          onChange={(v) => {
            setSigungu(v);
            setDong("");
          }}
          fetchUrl={
            sido
              ? `/api/address/sigungu?sido=${encodeURIComponent(sido)}`
              : null
          }
          disabled={!sido}
        />
        <ListSelect
          label="읍/면/동 선택"
          value={dong}
          onChange={setDong}
          fetchUrl={
            sido && sigungu
              ? `/api/address/eupmyeondong?sido=${encodeURIComponent(sido)}&sigungu=${encodeURIComponent(sigungu)}`
              : null
          }
          disabled={!sigungu}
        />
      </div>

      {/* API notice */}
      <div className="api-notice">
        API 승인키 발급 후 연결 예정입니다.
      </div>

      {/* Bottom row */}
      <div className="search-bottom-row">
        <label className="search-radio">
          <input
            type="radio"
            name="jibunSearchType"
            checked={searchType === "name"}
            onChange={() => setSearchType("name")}
          />
          단지명 입력
        </label>

        <label className="search-radio">
          <input
            type="radio"
            name="jibunSearchType"
            checked={searchType === "jibun"}
            onChange={() => setSearchType("jibun")}
          />
          지번 입력
        </label>

        {searchType === "jibun" ? (
          <div className="search-number-inputs">
            <input
              type="text"
              disabled
              className="search-input"
              style={{ width: 70 }}
            />
            <span className="search-separator">-</span>
            <input
              type="text"
              disabled
              className="search-input"
              style={{ width: 70 }}
            />
          </div>
        ) : (
          <input
            type="text"
            disabled
            className="search-input"
            style={{ width: 120 }}
          />
        )}

        <button disabled className="btn-search">
          검색
        </button>
      </div>
    </div>
  );
}
