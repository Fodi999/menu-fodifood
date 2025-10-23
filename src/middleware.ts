import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Поддерживаемые языки
const SUPPORTED_LOCALES = ['en', 'ru', 'pl'];
const DEFAULT_LOCALE = 'ru';

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

// Определить язык из Accept-Language header
function detectLanguageFromHeader(request: NextRequest): string {
  const acceptLanguage = request.headers.get('Accept-Language');
  
  if (!acceptLanguage) {
    return DEFAULT_LOCALE;
  }

  // Парсим Accept-Language header (например: "en-US,en;q=0.9,ru;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, qValue] = lang.trim().split(';');
      const quality = qValue ? parseFloat(qValue.split('=')[1]) : 1.0;
      // Берём только первые 2 символа (en-US -> en)
      const langCode = code.split('-')[0].toLowerCase();
      return { code: langCode, quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // Ищем первый поддерживаемый язык
  for (const lang of languages) {
    if (SUPPORTED_LOCALES.includes(lang.code)) {
      return lang.code;
    }
  }

  return DEFAULT_LOCALE;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // === 1. LANGUAGE DETECTION ===
  // Проверяем наличие cookie с языком
  let locale = request.cookies.get('NEXT_LOCALE')?.value;
  
  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    // Если cookie нет, определяем из Accept-Language
    locale = detectLanguageFromHeader(request);
    console.log(`🌍 Language detected from Accept-Language: ${locale}`);
  } else {
    console.log(`🌍 Language from cookie: ${locale}`);
  }

  // Создаём response с установленным cookie языка
  const response = NextResponse.next();
  
  // Устанавливаем cookie с языком (если его нет или он изменился)
  const currentCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (currentCookie !== locale) {
    response.cookies.set('NEXT_LOCALE', locale, {
      maxAge: 60 * 60 * 24 * 365, // 1 год
      path: '/',
      sameSite: 'lax',
    });
    console.log(`✅ Set NEXT_LOCALE cookie to: ${locale}`);
  }

  // === 2. AUTHENTICATION ===
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

  return response;
}

export const config = {
  // Применяем middleware ко всем маршрутам для определения языка
  matcher: [
    // Auth-защищённые маршруты
    "/admin/:path*", 
    "/business/:path*", 
    "/profile/:path*", 
    "/orders/:path*",
    // Все остальные маршруты для определения языка
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

