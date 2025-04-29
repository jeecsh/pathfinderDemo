import { NextRequest, NextResponse } from 'next/server';

if (!process.env.NEXT_PUBLIC_ORG_SERVICE_URL) {
  throw new Error('NEXT_PUBLIC_ORG_SERVICE_URL is not defined');
}

const ORG_SERVICE_URL = process.env.NEXT_PUBLIC_ORG_SERVICE_URL;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { 
          status: 401,
          headers: corsHeaders
        }
      );
    }

    const response = await fetch(`${ORG_SERVICE_URL}/organization/details`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    // Log response status and headers for debugging
    console.log('Organization service response:', {
      status: response.status,
      statusText: response.statusText
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch organization data' },
        { 
          status: response.status,
          headers: corsHeaders 
        }
      );
    }

    // Return response with CORS headers
    return NextResponse.json(data, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error in organization details route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders 
      }
    );
  }
}
