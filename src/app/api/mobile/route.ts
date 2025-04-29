import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

async function verifyToken(token: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return null;
    }

    const userData = await response.json();
    
    const { data: user, error } = await supabase
      .from('webusers')
      .select('id, email, role, organization_id')
      .eq('id', userData.userId)
      .eq('is_active', true)
      .single();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// GET mobile users and subscription status
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

    // Check subscription status
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('mobile_app_enabled')
      .eq('organization_id', userData.organization_id)
      .single();

    if (error) {
      console.error('Subscription fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch subscription status' },
        { status: 500 }
      );
    }

    // Also fetch mobile users if subscription is enabled
    let mobileUsers: { name: string; email: string; role: string; notification_enabled: boolean }[] = [];
    if (subscription?.mobile_app_enabled) {
      const { data: users, error: usersError } = await supabase
        .from('mobile_users')
        .select('name, email, role, notification_enabled')  
        .eq('org_id', userData.organization_id)

      if (usersError) {
        console.error('Mobile users fetch error:', usersError);
      } else {
        mobileUsers = users || [];
      }
    }

    return NextResponse.json({
      mobileAppEnabled: subscription?.mobile_app_enabled ?? false,
      mobileUsers: subscription?.mobile_app_enabled ? mobileUsers : []
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new mobile user
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
    const { name, email, mobile_role, notification_enabled } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('mobile_users')
      .insert([{
        name: name || email.split('@')[0], // Use part of email as name if not provided
        email,
        role: mobile_role || null,
        notification_enabled: notification_enabled || false,
        org_id: userData.organization_id
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
        { error: 'Failed to create mobile user' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating mobile user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE mobile user
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
    const email = searchParams.get('email');

    if (!id && !email) {
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('mobile_users')
      .delete()
      .eq('org_id', userData.organization_id);

    if (id) {
      query = query.eq('id', id);
    } else if (email) {
      query = query.eq('email', email);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete mobile user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting mobile user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH update mobile user
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
    const { id, email, name, role, notification_enabled } = body;

    if (!id && !email) {
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (notification_enabled !== undefined) updateData.notification_enabled = notification_enabled;

    // If no fields to update, return early
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('mobile_users')
      .update(updateData)
      .eq('org_id', userData.organization_id);

    if (id) {
      query = query.eq('id', id);
    } else if (email) {
      query = query.eq('email', email);
    }

    const { data, error } = await query.select().single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update mobile user' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating mobile user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
