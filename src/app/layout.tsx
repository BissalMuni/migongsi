import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "부동산공시가격 알리미",
  description: "부동산 주택가격 의견 조회 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <div id="wrap">
          <Header />

          {/* Sub Visual Banner */}
          <div className="sub-visual-wrap">
            <h2>미공시 공동주택 공시가격열람</h2>
          </div>

          {/* Sub Page */}
          <div className="sub-page-bg">
            <div className="sub-page-wrap-full">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
