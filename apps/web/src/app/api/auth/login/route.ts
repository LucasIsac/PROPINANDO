import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Mock successful login response
    // In production, this would validate credentials against database
    const mockResponse = {
      success: true,
      user: {
        id: 'user_' + Date.now(),
        email: email,
        nombre: 'Usuario',
        apellido: 'Demo',
        role: 'EMPLOYEE',
        status: 'ACTIVO',
      },
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
    };

    console.log('[Mock Login] User authenticated:', mockResponse);

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('[Mock Login] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}
