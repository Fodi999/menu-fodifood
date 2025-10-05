import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Простая функция для проверки JWT токена от Go API
function getAuthToken(request: NextRequest) {
  // Проверяем токен в cookie
  const tokenCookie = request.cookies.get('auth_token');
  if (tokenCookie) {
    return tokenCookie.value;
  }
  
  // Проверяем токен в заголовке Authorization
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Получаем токен от Go API
  const token = getAuthToken(request);

  console.log(`🛡️ Middleware: ${pathname} | Authenticated: ${!!token}`);

  // Защищенные маршруты для админов и пользователей
  if (pathname.startsWith("/admin") || pathname.startsWith("/profile") || pathname.startsWith("/orders")) {
    if (!token) {
      console.log(`❌ Unauthorized access to ${pathname}, redirecting to signin`);
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    
    // Для админки - дополнительная проверка будет на Go API
    // Здесь просто проверяем наличие токена
    console.log(`✅ Token found, allowing access to ${pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/orders/:path*"],
};
