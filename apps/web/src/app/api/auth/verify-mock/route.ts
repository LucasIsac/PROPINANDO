import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      );
    }

    // Mock response - simulating MetaMap webhook
    // TODO: replace with real HMAC validation when METAMAP_WEBHOOK_SECRET is available
    // TODO: call actual backend to update user status in database
    const mockResponse = {
      success: true,
      status: 'approved',
      identityId: `mock_${Date.now()}`,
      metamapIdentityId: `mock_identity_${userId}_${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: 'Identidad verificada exitosamente',
    };

    // In production, this would:
    // 1. Validate HMAC signature from MetaMap webhook
    // 2. Update user record in database: identity_verified = true, status = ACTIVO
    // 3. Log to audit_log table

    console.log('[Mock MetaMap] Identity verified:', mockResponse);

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('[Mock MetaMap] Error:', error);
    return NextResponse.json(
      { error: 'Error al verificar identidad' },
      { status: 500 }
    );
  }
}
