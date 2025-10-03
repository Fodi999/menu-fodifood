import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - получить все продукты
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    
    // Возвращаем детальную информацию об ошибке
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        error: "Failed to fetch products",
        details: errorMessage,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

// POST - создать новый продукт
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const created = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description ?? null,
        price: body.price,
        imageUrl: body.imageUrl ?? null,
        weight: body.weight ?? null,
        category: body.category,
      },
    });
    
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
