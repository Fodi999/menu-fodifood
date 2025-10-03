import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Простой запрос к базе для проверки подключения
    await prisma.$queryRaw`SELECT NOW()`;
    
    return NextResponse.json({ 
      ok: true, 
      message: "Database connection successful",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ 
      ok: false, 
      error: "Database connection failed" 
    }, { status: 500 });
  }
}
