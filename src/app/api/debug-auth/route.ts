import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Проверяем сессию через auth()
    const session = await auth();

    // Проверяем cookies
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('next-auth.session-token') || 
                         cookieStore.get('__Secure-next-auth.session-token');

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      
      // Сессия
      session: session ? {
        user: {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name,
          role: session.user?.role,
        },
        expires: session.expires,
      } : null,
      
      // Cookie
      cookie: sessionCookie ? {
        name: sessionCookie.name,
        value: sessionCookie.value.substring(0, 20) + '...',
        exists: true,
      } : {
        exists: false,
        message: 'Session cookie not found'
      },
      
      // Переменные окружения
      env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET_EXISTS: !!process.env.NEXTAUTH_SECRET,
        DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
      },
      
      // Статус
      status: {
        authenticated: !!session,
        hasCookie: !!sessionCookie,
      }
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
