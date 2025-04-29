import { type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const authHeader = req.headers.get('authorization');

    // Log request details (excluding sensitive data)
    console.log('Complete registration request:', {
      hasAuth: Boolean(authHeader),
      authType: authHeader?.startsWith('Bearer ') ? 'Bearer' : 'Other',
      dataKeys: Object.keys(data)
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/complete-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.get('authorization')?.startsWith('Bearer ')
          ? req.headers.get('authorization')!
          : `Bearer ${req.headers.get('authorization') || ''}`,
      },
      body: JSON.stringify(data)

    });

    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        console.error('Backend registration error:', {
          status: response.status,
          error: error
        });
        throw new Error(error.message || `Registration failed with status ${response.status}`);
      }
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { details?: unknown };
    console.error('Registration completion error:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      details: err.details
    });
    return new Response(JSON.stringify({
      message: err.message || 'Registration completion failed',
      details: err.details || null
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
