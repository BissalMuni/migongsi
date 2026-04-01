import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { BASE_URL } from "@/lib/config";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const stateParam = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  const baseUrl = BASE_URL;

  if (error) {
    return NextResponse.redirect(
      `${baseUrl}?authError=${encodeURIComponent("네이버 인증이 취소되었습니다.")}`
    );
  }

  if (!code || !stateParam) {
    return NextResponse.redirect(
      `${baseUrl}?authError=${encodeURIComponent("인증 정보가 부족합니다.")}`
    );
  }

  // state에서 dong/ho/roadName/name 추출
  let dong = "";
  let ho = "";
  let roadName = "";
  let unitName = "";
  try {
    const stateData = JSON.parse(
      Buffer.from(stateParam, "base64url").toString("utf8")
    );
    dong = stateData.dong || "";
    ho = stateData.ho || "";
    roadName = stateData.roadName || "";
    unitName = stateData.name || "";
  } catch {
    return NextResponse.redirect(
      `${baseUrl}?authError=${encodeURIComponent("잘못된 인증 상태입니다.")}`
    );
  }

  const clientId = process.env.NAVER_CLIENT_ID!;
  const clientSecret = process.env.NAVER_CLIENT_SECRET!;
  const redirectUri = `${baseUrl}/api/auth/naver/callback`;

  try {
    // 1. 액세스 토큰 요청
    const tokenUrl = new URL("https://nid.naver.com/oauth2.0/token");
    tokenUrl.searchParams.set("grant_type", "authorization_code");
    tokenUrl.searchParams.set("client_id", clientId);
    tokenUrl.searchParams.set("client_secret", clientSecret);
    tokenUrl.searchParams.set("code", code);
    tokenUrl.searchParams.set("state", stateParam);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);

    const tokenRes = await fetch(tokenUrl.toString());
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return NextResponse.redirect(
        `${baseUrl}?authError=${encodeURIComponent("네이버 토큰 발급 실패: " + tokenData.error_description)}`
      );
    }

    // 2. 사용자 프로필 요청
    const profileRes = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profileData = await profileRes.json();

    if (profileData.resultcode !== "00") {
      return NextResponse.redirect(
        `${baseUrl}?authError=${encodeURIComponent("네이버 프로필 조회 실패")}`
      );
    }

    const { name, birthday, birthyear } = profileData.response;

    if (!name || !birthday || !birthyear) {
      return NextResponse.redirect(
        `${baseUrl}?authError=${encodeURIComponent("이름 또는 생년월일 정보 제공에 동의해주세요.")}`
      );
    }

    // 생년월일 조합: birthyear(1985) + birthday(01-01) → "19850101"
    const birthDate = birthyear + birthday.replace("-", "");

    // 3. 해시 생성 및 DB 매칭
    const ownerHash = createHash("sha256")
      .update(name.trim() + birthDate, "utf8")
      .digest("hex");

    const housing = await prisma.housing.findFirst({
      where: { dong, ho, ownerHash },
    });

    if (!housing) {
      return NextResponse.redirect(
        `${baseUrl}?authError=${encodeURIComponent("해당 동/호의 소유자 정보와 일치하지 않습니다.")}`
      );
    }

    // 4. 인증 성공 - 쿠키에 세션 저장
    const sessionToken = createHash("sha256")
      .update(ownerHash + Date.now().toString(), "utf8")
      .digest("hex");

    const redirectParams = new URLSearchParams({
      authSuccess: "true",
      dong,
      ho,
      ...(roadName && { roadName }),
      ...(unitName && { name: unitName }),
    });
    const response = NextResponse.redirect(`${baseUrl}?${redirectParams}`);

    response.cookies.set("auth_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 30, // 30분
      path: "/",
    });

    // 세션 정보를 쿠키에 저장 (서버에서 확인용)
    response.cookies.set(
      "auth_data",
      Buffer.from(JSON.stringify({ dong, ho, ownerHash })).toString("base64url"),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 30,
        path: "/",
      }
    );

    return response;
  } catch (err) {
    console.error("Naver OAuth error:", err);
    return NextResponse.redirect(
      `${baseUrl}?authError=${encodeURIComponent("인증 처리 중 오류가 발생했습니다.")}`
    );
  }
}
