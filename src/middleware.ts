import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Intercepta a requisição 'preflight' do navegador do celular e responde "OK" (200) na mesma hora!
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
