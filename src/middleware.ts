import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Простая функция для проверки JWT токена от Go API
function getAuthToken(request: NextRequest) {
  // Проверяем токен в cookie (единый ключ "token")
  const tokenCookie = request.cookies.get('token');
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

// Получить роль из cookie (устанавливается при логине)
function getUserRole(request: NextRequest): string | null {
  const roleCookie = request.cookies.get('role');
  return roleCookie?.value || null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Получаем токен от Go API
  const token = getAuthToken(request);
  const role = getUserRole(request);

  console.log(`🛡️ Middleware: ${pathname} | Authenticated: ${!!token} | Role: ${role || 'none'}`);

  // Защищенные маршруты для всех авторизованных
  const protectedPaths = ["/admin", "/business", "/profile", "/orders"];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath) {
    if (!token) {
      console.log(`❌ Unauthorized access to ${pathname}, redirecting to signin`);
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    
    // Проверка доступа по ролям
    if (pathname.startsWith("/admin") && role !== "admin") {
      console.log(`❌ Role ${role} attempted to access admin area, redirecting`);
      // Редирект на соответствующий дашборд
      if (role === "business_owner") {
        return NextResponse.redirect(new URL("/business/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/business") && role !== "business_owner" && role !== "admin") {
      console.log(`❌ Role ${role} attempted to access business area, redirecting`);
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    console.log(`✅ Token found, allowing access to ${pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/business/:path*", "/profile/:path*", "/orders/:path*"],
};

