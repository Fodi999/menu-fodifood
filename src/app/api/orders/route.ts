import { NextResponse } from 'next/server';

/**
 * API Route для получения заказов
 * На данный момент это заглушка, так как все заказы идут через Go Backend
 */
export async function GET() {
  // В продакшене данные приходят с Go backend
  // Это заглушка для клиентского запроса на Next.js сервере
  return NextResponse.json([]);
}

/**
 * API Route для создания заказа
 * Перенаправляет на Go Backend
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    // Перенаправляем на Go backend
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to create order' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
