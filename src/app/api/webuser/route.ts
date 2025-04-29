/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Verify token with auth server
async function verifyToken(token: string) {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }

  try {
    // Call the auth server's verify endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Verify error:', errorData);
      return null;
    }

    const userData = await response.json();
    
    // Verify the user exists in Supabase and is active
    const { data: user, error } = await supabase
      .from('webusers')
      .select('id, email, role, organization_id')
      .eq('id', userData.userId)
      .eq('is_active', true)
      .single();

    if (error || !user) {
      console.error('Supabase user verification failed:', error);
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organization_id
    };

  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// GET all users
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const userData = await verifyToken(token);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('webusers')
      .select('*')
      .eq('organization_id', userData.organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new user
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const userData = await verifyToken(token);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, role } = body;
    
    if (!email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('webusers')
      .insert([{
        email,
        role,
        is_active: true,
        organization_id: userData.organizationId
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH update user
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const userData = await verifyToken(token);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, is_active } = body;

    const { error } = await supabase
      .from('webusers')
      .update({ is_active })
      .eq('id', id)
      .eq('organization_id', userData.organizationId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE user
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const userData = await verifyToken(token);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('webusers')
      .delete()
      .eq('id', id)
      .eq('organization_id', userData.organizationId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
