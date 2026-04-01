"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuGroups = [
  {
    title: "공동주택",
    items: [
      { label: "공시가격 열람", href: "/" },
      // { label: "의견제출", href: "#" },
      // { label: "이의신청", href: "#" },
      // { label: "공동주택가격 활용분야", href: "#" },
    ],
  },
  {
    title: "표준주택",
    items: [
      { label: "공시가격 열람", href: "/standard" },
    ],
  },
  {
    title: "개별주택",
    items: [
      { label: "공시가격 열람", href: "/individual" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="side-nav-wrap">
      {/* Title */}
      <div className="side-tit-wrap">
        <p>주택</p>
      </div>

      {/* Nav List */}
      <div className="side-nav-list">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p
              className={`side-2dep-tit${group.items.some((item) => item.href === pathname) ? " nav-on" : ""}`}
            >
              {group.title}
            </p>
            <ul className="side-2dep-list">
              {group.items.map((item) => {
                const isActive = item.href === pathname;
                return (
                  <li key={`${group.title}-${item.label}`}>
                    <Link
                      href={item.href}
                      className={isActive ? "nav-on" : ""}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Admin Link */}
        <div>
          <p className="side-2dep-tit">관리</p>
          <ul className="side-2dep-list">
            <li>
              <Link
                href="/admin/upload"
                className={pathname === "/admin/upload" ? "nav-on" : ""}
              >
                데이터 업로드
              </Link>
            </li>
          </ul>
        </div>

        {/* Phone */}
        <div className="btn-side-tel">
          <svg
            className="phone-icon"
            style={{ display: "inline-block" }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <p></p>
        </div>

        {/* Contact Link */}
        <a href="#" className="btn-side-contact">
          개별공시지가/개별주택가격 담당자 연락처 안내
        </a>
      </div>
    </div>
  );
}
