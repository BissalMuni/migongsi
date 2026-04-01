"use client";

interface AuthModalProps {
  dong: string;
  ho: string;
  roadName?: string;
  name?: string;
  onClose: () => void;
}

export default function AuthModal({ dong, ho, roadName, name, onClose }: AuthModalProps) {
  const handleNaverLogin = () => {
    const data: Record<string, string> = { dong, ho };
    if (roadName) data.roadName = roadName;
    if (name) data.name = name;
    sessionStorage.setItem("pendingAuth", JSON.stringify(data));
    const params = new URLSearchParams(data);
    window.location.href = `/api/auth/naver?${params}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>본인인증</h3>
          <button onClick={onClose} className="modal-close">
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p className="auth-desc">
            소유자 본인만 공동주택가격을 열람할 수 있습니다.
            <br />
            본인인증 후 선택하신 동/호의 가격을 확인하실 수 있습니다.
          </p>
          <div className="auth-info">
            <span>
              선택된 주택: <strong>{name ? `${name} ` : ""}{dong}동 {ho}호</strong>
            </span>
          </div>
          <div className="auth-buttons">
            <button onClick={handleNaverLogin} className="btn-naver">
              네이버 로그인으로 인증
            </button>
            <button disabled className="btn-nice" title="준비 중">
              NICE 본인인증 (준비 중)
            </button>
          </div>
          <p className="auth-notice">
            * 네이버 로그인 시 이름, 생년월일 정보 제공에 동의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
