import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function GET(request: NextRequest) {
  const dong = request.nextUrl.searchParams.get("dong") || "";
  const ho = request.nextUrl.searchParams.get("ho") || "";

  const clientId = process.env.NAVER_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "네이버 OAuth 설정이 되어있지 않습니다." },
      { status: 500 }
    );
  }

  const state = randomBytes(16).toString("hex");
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"}/api/auth/naver/callback`;

  // state에 dong/ho 정보를 포함 (base64 인코딩)
  const stateData = Buffer.from(JSON.stringify({ state, dong, ho })).toString("base64url");

  const naverAuthUrl = new URL("https://nid.naver.com/oauth2.0/authorize");
  naverAuthUrl.searchParams.set("response_type", "code");
  naverAuthUrl.searchParams.set("client_id", clientId);
  naverAuthUrl.searchParams.set("redirect_uri", redirectUri);
  naverAuthUrl.searchParams.set("state", stateData);

  return NextResponse.redirect(naverAuthUrl.toString());
}
