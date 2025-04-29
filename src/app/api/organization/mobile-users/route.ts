import { NextRequest, NextResponse } from 'next/server';

if (!process.env.NEXT_PUBLIC_ORG_SERVICE_URL) {
  throw new Error('NEXT_PUBLIC_ORG_SERVICE_URL is not defined');
}

const ORG_SERVICE_URL = process.env.NEXT_PUBLIC_ORG_SERVICE_URL;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      );
    }

    const response = await fetch(`${ORG_SERVICE_URL}/organization/mobile-users`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch mobile users' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in mobile users route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}