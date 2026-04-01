export default function IndividualHousingPage() {
  return (
    <>
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
