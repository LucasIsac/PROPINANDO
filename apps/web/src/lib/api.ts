import type { RegisterFormData } from '@/schemas/register.schema';

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export async function registerEmployee(
  data: RegisterFormData,
  fotoUrl: string
): Promise<RegisterResponse> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        fotoUrl,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Error al registrar',
      };
    }

    return {
      success: true,
      message: 'Registro exitoso',
      userId: result.userId,
    };
  } catch {
    return {
      success: false,
      message: 'Error de conexión. Intenta nuevamente.',
    };
  }
}
