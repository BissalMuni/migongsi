import Link from "next/link";

export default function Header() {
  return (
    <header className="header-wrap">
      <div className="header-inner">
        {/* Logo */}
        <h1 className="header-logo">
          <Link href="/">
            <svg
              className="header-logo-icon"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="8" fill="#1a4899" />
              <path
                d="M12 36V20l12-8 12 8v16H12z"
                fill="white"
                opacity="0.9"
              />
              <rect x="18" y="26" width="5" height="10" rx="1" fill="#1a4899" />
              <rect
                x="26"
                y="22"
                width="5"
                height="6"
                rx="1"
                fill="#1a4899"
                opacity="0.5"
              />
              <circle cx="24" cy="18" r="2" fill="#1a4899" />
            </svg>
            <span className="header-logo-text">
              부동산 공시가격 <strong>알리미</strong>
            </span>
          </Link>
        </h1>

        {/* Navigation */}
        <nav className="nav-wrap">
          <ul className="nav-list">
            <li>
              <Link href="/" className="active">
                공시가격열람
              </Link>
            </li>
          </ul>
        </nav>

        {/* Side Logos */}
        <div className="side-logos">
          <a
            href="https://www.molit.go.kr"
            target="_blank"
            rel="noopener noreferrer"
          >
            국토교통부
          </a>
          <a
            href="https://www.reb.or.kr"
            target="_blank"
            rel="noopener noreferrer"
          >
            한국부동산원
          </a>
        </div>
      </div>
    </header>
  );
}
