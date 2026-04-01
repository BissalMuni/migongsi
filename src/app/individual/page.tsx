export default function IndividualHousingPage() {
  return (
    <>
      {/* Title Box */}
      <div className="titlebox">
        <ul className="breadcrumb">
          <li>HOME</li>
          <li className="arrow">공시가격열람</li>
          <li className="arrow">
            <strong>개별주택 공시가격 열람</strong>
          </li>
        </ul>

        <div className="title-area">
          <div className="title-text">
            <h3>개별주택가격 열람</h3>
            <p className="year-info">2026년도 1.1 기준 개별주택가격(안)</p>
          </div>
          <svg
            className="title-img"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="15" y="30" width="50" height="30" rx="2" fill="#1a4899" opacity="0.15" />
            <polygon points="40,12 10,30 70,30" fill="#1a4899" opacity="0.2" />
            <rect x="22" y="38" width="8" height="8" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="36" y="38" width="8" height="8" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="50" y="38" width="8" height="8" rx="0.5" fill="#1a4899" opacity="0.3" />
            <rect x="34" y="50" width="12" height="10" rx="0.5" fill="#1a4899" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="content">
        <div className="unpublished-notice">
          <div className="unpublished-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
              <circle cx="24" cy="24" r="22" stroke="#1a4899" strokeWidth="2" fill="#f0f4fa" />
              <path d="M24 14v14" stroke="#1a4899" strokeWidth="3" strokeLinecap="round" />
              <circle cx="24" cy="34" r="2" fill="#1a4899" />
            </svg>
          </div>
          <h4 className="unpublished-title">미공시</h4>
          <p className="unpublished-desc">
            개별주택 공시가격은 현재 공시되지 않았습니다.
          </p>
        </div>
      </div>
    </>
  );
}
