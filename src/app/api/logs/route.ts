import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

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

// GET logs
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

    // Check if user is admin
    if (userData.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const action = searchParams.get('action');
    const entity = searchParams.get('entity');
    const userId = searchParams.get('userId');

    // Build query
    let query = supabase
      .from('activity_logs')
      .select(`
        id,
        action,
        entity,
        entity_id,
        details,
        created_at,
        user_id,
        user_email
      `)
      .eq('org_id', userData.organization_id)
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (action) {
      query = query.eq('action', action);
    }

    if (entity) {
      query = query.eq('entity', entity);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch logs' },
        { status: 500 }
      );
    }

    // Get total count for pagination with the same filters
    let countQuery = supabase
      .from('activity_logs')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', userData.organization_id);

    // Apply the same filters to the count query
    if (action) {
      countQuery = countQuery.eq('action', action);
    }

    if (entity) {
      countQuery = countQuery.eq('entity', entity);
    }

    if (userId) {
      countQuery = countQuery.eq('user_id', userId);
    }

    const { count: totalCount, error: countError } = await countQuery;

    if (countError) {
      console.error('Error counting logs:', countError);
    }

    return NextResponse.json({
      logs: data || [],
      total: totalCount || 0,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new log
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
    const { action, entity, entity_id, details } = body;

    if (!action || !entity) {
      return NextResponse.json(
        { error: 'Action and entity are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{
        id: uuidv4(),
        action,
        entity,
        entity_id: entity_id || null,
        details: details || null,
        user_id: userData.id,
        user_email: userData.email,
        org_id: userData.organization_id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating log:', error);
      return NextResponse.json(
        { error: 'Failed to create log' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
