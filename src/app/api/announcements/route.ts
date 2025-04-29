import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

//this function for verfining the 
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

// GET announcements
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
      .from('announcements')
      .select('*')
      .eq('org_id', userData.organization_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching announcements:', error);
      return NextResponse.json(
        { error: 'Failed to fetch announcements' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST new announcement
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

    // Parse form data
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    const image = formData.get('image') as File | null;

    if (!title || !body) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      );
    }

    let imageUrl = null;

    // Upload image if provided
    if (image) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${userData.organization_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('announcements-images')
        .upload(filePath, image);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('announcements-images')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    // Insert announcement
    const { data, error } = await supabase
      .from('announcements')
      .insert([{
        id: uuidv4(),
        title,
        body,
        image_url: imageUrl,
        org_id: userData.organization_id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating announcement:', error);
      return NextResponse.json(
        { error: 'Failed to create announcement' },
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

// PATCH update announcement
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

    // Parse form data
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    const image = formData.get('image') as File | null;

    if (!id || !title || !body) {
      return NextResponse.json(
        { error: 'ID, title, and body are required' },
        { status: 400 }
      );
    }

    // Get current announcement to check if it exists and belongs to the organization
    const { data: existingAnnouncement, error: fetchError } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .eq('org_id', userData.organization_id)
      .single();

    if (fetchError || !existingAnnouncement) {
      return NextResponse.json(
        { error: 'Announcement not found or access denied' },
        { status: 404 }
      );
    }

    let imageUrl = existingAnnouncement.image_url;

    // Upload new image if provided
    if (image) {
      // Delete old image if exists
      if (existingAnnouncement.image_url) {
        const oldImagePath = existingAnnouncement.image_url.split('/').pop();
        if (oldImagePath) {
          const { error: deleteError } = await supabase.storage
            .from('announcements-images')
            .remove([`${userData.organization_id}/${oldImagePath}`]);
          
          if (deleteError) {
            console.error('Error deleting old image:', deleteError);
          }
        }
      }

      // Upload new image
      const fileExt = image.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${userData.organization_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('announcements-images')
        .upload(filePath, image);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('announcements-images')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    // Update announcement
    const { data, error } = await supabase
      .from('announcements')
      .update({
        title,
        body,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('org_id', userData.organization_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating announcement:', error);
      return NextResponse.json(
        { error: 'Failed to update announcement' },
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

// DELETE announcement
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
        { error: 'Announcement ID is required' },
        { status: 400 }
      );
    }

    // Get announcement to check if it exists and belongs to the organization
    const { data: announcement, error: fetchError } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .eq('org_id', userData.organization_id)
      .single();

    if (fetchError || !announcement) {
      return NextResponse.json(
        { error: 'Announcement not found or access denied' },
        { status: 404 }
      );
    }

    // Delete image if exists
    if (announcement.image_url) {
      const imagePath = announcement.image_url.split('/').pop();
      if (imagePath) {
        const { error: deleteImageError } = await supabase.storage
          .from('announcements-images')
          .remove([`${userData.organization_id}/${imagePath}`]);
        
        if (deleteImageError) {
          console.error('Error deleting image:', deleteImageError);
        }
      }
    }

    // Delete announcement
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id)
      .eq('org_id', userData.organization_id);

    if (error) {
      console.error('Error deleting announcement:', error);
      return NextResponse.json(
        { error: 'Failed to delete announcement' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
