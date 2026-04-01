"use client";

import { useState } from "react";
import RoadNameSearch from "./RoadNameSearch";
import JibunSearch from "./JibunSearch";

interface SearchTabsProps {
  onSearch: (params: Record<string, string>) => void;
  authenticated?: boolean;
  authDong?: string;
  authHo?: string;
}

export default function SearchTabs({ onSearch, authenticated, authDong, authHo }: SearchTabsProps) {
  const [activeTab, setActiveTab] = useState<"road" | "jibun">("road");

  return (
    <div>
      {/* Main tabs: 텍스트검색 / 지도검색 */}
      <div className="main-tab-area">
        <button className="main-tab active">텍스트검색</button>
        <button className="main-tab" disabled>
          지도검색
        </button>
      </div>

      {/* Search box (red box) */}
      <div className="search-box">
        <div className="search-layout">
          {/* LEFT: illustration + text */}
          <div className="search-left-panel">
            <div className="search-header-text">
              <span className="search-header-title">Search</span>
              <span className="search-header-desc">공동주택가격 검색</span>
            </div>
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="search-illust"
            >
              {/* Magnifying glass */}
              <circle
                cx="32"
                cy="32"
                r="20"
                stroke="#999"
                strokeWidth="3"
                fill="none"
                opacity="0.4"
              />
              <circle
                cx="32"
                cy="32"
                r="16"
                fill="white"
                opacity="0.2"
              />
              <line
                x1="47"
                y1="47"
                x2="58"
                y2="58"
                stroke="#888"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.4"
              />
              {/* Person silhouettes */}
              <circle cx="58" cy="56" r="11" fill="#c9a96e" opacity="0.75" />
              <ellipse
                cx="58"
                cy="82"
                rx="18"
                ry="13"
                fill="#c9a96e"
                opacity="0.55"
              />
              <circle cx="78" cy="60" r="8" fill="#b89560" opacity="0.55" />
              <ellipse
                cx="78"
                cy="80"
                rx="14"
                ry="10"
                fill="#b89560"
                opacity="0.4"
              />
            </svg>
          </div>

          {/* RIGHT: sub-tabs + list boxes + search controls */}
          <div className="search-right-panel">
            {/* Top bar: sub-tabs + help */}
            <div className="search-top-bar">
              <div className="search-sub-tabs">
                <button
                  onClick={() => setActiveTab("road")}
                  className={`search-sub-tab${activeTab === "road" ? " active-sub" : ""}`}
                >
                  도로명 검색
                </button>
                <button
                  onClick={() => setActiveTab("jibun")}
                  className={`search-sub-tab${activeTab === "jibun" ? " active-sub" : ""}`}
                >
                  지번 검색
                </button>
              </div>
              <button className="btn-road-help" type="button" disabled>
                도로명 주소관 <span className="help-icon">?</span>
              </button>
            </div>

            {/* Form content (blue box + orange box) */}
            <div className="search-form-content">
              {activeTab === "road" ? (
                <RoadNameSearch onSearch={onSearch} authenticated={authenticated} authDong={authDong} authHo={authHo} />
              ) : (
                <JibunSearch />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
