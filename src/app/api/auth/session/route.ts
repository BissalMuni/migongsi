import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authSession = request.cookies.get("auth_session")?.value;
  const authData = request.cookies.get("auth_data")?.value;

  if (!authSession || !authData) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const data = JSON.parse(
      Buffer.from(authData, "base64url").toString("utf8")
    );
    return NextResponse.json({
      authenticated: true,
      dong: data.dong,
      ho: data.ho,
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("auth_session");
  response.cookies.delete("auth_data");
  return response;
}
