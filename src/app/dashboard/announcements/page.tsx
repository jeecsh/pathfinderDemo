'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Edit, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";

// Define the Announcement type
interface Announcement {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  created_at: string;
  org_id: string;
}

// Initial mock data
const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Welcome to our platform!',
    body: 'We are excited to have you here. This is the first announcement.',
    image_url: null,
    created_at: new Date().toISOString(),
    org_id: 'org-123'
  },
  {
    id: '2',
    title: 'New features available',
    body: 'Check out the latest updates we have added to improve your experience.',
    image_url: null,
    created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    org_id: 'org-123'
  }
];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initialize with mock data
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setAnnouncements(initialAnnouncements);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setImageFile(null);
    setImagePreview(null);
    setSelectedAnnouncement(null);
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      try {
        const newAnnouncement: Announcement = {
          id: Math.random().toString(36).substring(2, 9),
          title,
          body,
          image_url: imagePreview,
          created_at: new Date().toISOString(),
          org_id: 'org-123'
        };

        setAnnouncements(prev => [newAnnouncement, ...prev]);
        setIsAddDialogOpen(false);
        resetForm();
        toast.success("Announcement added successfully");
      } catch (error) {
        console.error('Error adding announcement:', error);
        toast.error("Failed to add announcement");
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
  };

  const handleEditAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAnnouncement) return;
    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      try {
        const updatedAnnouncements = announcements.map(announcement => {
          if (announcement.id === selectedAnnouncement.id) {
            return {
              ...announcement,
              title,
              body,
              image_url: imagePreview
            };
          }
          return announcement;
        });

        setAnnouncements(updatedAnnouncements);
        setIsEditDialogOpen(false);
        resetForm();
        toast.success("Announcement updated successfully");
      } catch (error) {
        console.error('Error updating announcement:', error);
        toast.error("Failed to update announcement");
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    setDeletingId(id);

    // Simulate API delay
    setTimeout(() => {
      try {
        const filteredAnnouncements = announcements.filter(announcement => announcement.id !== id);
        setAnnouncements(filteredAnnouncements);
        toast.success("Announcement deleted successfully");
      } catch (error) {
        console.error('Error deleting announcement:', error);
        toast.error("Failed to delete announcement");
      } finally {
        setDeletingId(null);
      }
    }, 800);
  };

  const openEditDialog = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setTitle(announcement.title);
    setBody(announcement.body);
    setImagePreview(announcement.image_url);
    setIsEditDialogOpen(true);
  };

  const colorTheme = '#3b82f6'; // Default blue color, you can change this

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold" style={{ color: colorTheme }}>Announcements</h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          style={{ backgroundColor: colorTheme }}
          className="text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Announcement
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No announcements yet. Create your first announcement!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="overflow-hidden flex flex-col">
              {announcement.image_url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={announcement.image_url}
                    alt={announcement.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{announcement.title}</CardTitle>
                <CardDescription className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(announcement.created_at), 'MMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="whitespace-pre-wrap">{announcement.body}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(announcement)}
                  style={{ 
                    color: colorTheme,
                    borderColor: colorTheme
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteAnnouncement(announcement.id)}
                  disabled={deletingId === announcement.id}
                >
                  {deletingId === announcement.id ? (
                    <>
                      <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-b-transparent"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add Announcement Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Announcement</DialogTitle>
            <DialogDescription>
              Create a new announcement to share with your users.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAnnouncement}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Announcement title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
                  placeholder="Announcement content..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Image (Optional)</Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {imagePreview && (
                    <div className="relative h-16 w-16 rounded overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                style={{ backgroundColor: colorTheme }}
                className="text-white"
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                    Adding...
                  </>
                ) : (
                  'Add Announcement'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update the announcement details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditAnnouncement}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Announcement title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-body">Body</Label>
                <Textarea
                  id="edit-body"
                  value={body}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
                  placeholder="Announcement content..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-image">Image (Optional)</Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {imagePreview && (
                    <div className="relative h-16 w-16 rounded overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                style={{ backgroundColor: colorTheme }}
                className="text-white"
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                    Updating...
                  </>
                ) : (
                  'Update Announcement'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}