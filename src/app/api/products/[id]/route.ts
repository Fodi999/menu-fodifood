import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - получить один продукт
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT - обновить продукт
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description ?? null,
        price: body.price,
        imageUrl: body.imageUrl ?? null,
        weight: body.weight ?? null,
        category: body.category,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - удалить продукт
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
