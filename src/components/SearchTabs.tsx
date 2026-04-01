"use client";

import RoadNameSearch from "./RoadNameSearch";

interface SearchTabsProps {
  onSearch: (params: Record<string, string>) => void;
  authenticated?: boolean;
  authDong?: string;
  authHo?: string;
}

export default function SearchTabs({ onSearch, authenticated, authDong, authHo }: SearchTabsProps) {
  return (
    <div>
      {/* Main tabs */}
      <div className="main-tab-area">
        <button className="main-tab active">주소검색</button>
      </div>

      {/* Search box */}
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

          {/* RIGHT: list boxes + search controls */}
          <div className="search-right-panel">
            {/* Form content */}
            <div className="search-form-content">
              <RoadNameSearch onSearch={onSearch} authenticated={authenticated} authDong={authDong} authHo={authHo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
