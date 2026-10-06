import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE = "orma_session";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const secret = getSecret();

  let isAuthed = false;
  if (token && secret) {
    try {
      await jwtVerify(token, secret);
      isAuthed = true;
    } catch {
      isAuthed = false;
    }
  }

  if (pathname.startsWith("/diary") && !isAuthed) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if ((pathname === "/login" || pathname === "/register") && isAuthed) {
    return NextResponse.redirect(new URL("/diary", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/diary/:path*", "/login", "/register"],
};
