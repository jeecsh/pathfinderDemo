'use client';

import { useState, useEffect } from 'react';
import { useOrgTheme } from '@/hooks/useOrgTheme';
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
import styles from '@/styles/dashboard.module.css';

interface Announcement {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  created_at: string;
  org_id: string;
}

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
    created_at: new Date(Date.now() - 86400000).toISOString(),
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

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { 
    colorTheme, 
    getGradient, 
    getHoverGradient, 
    adjustColor, 
    getContrastText 
  } = useOrgTheme();

  useEffect(() => {
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
        toast.error("Failed to update announcement");
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    setDeletingId(id);

    setTimeout(() => {
      try {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
        toast.success("Announcement deleted successfully");
      } catch (error) {
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

  return (
    <div className="container mx-auto p-4">
      <div className={styles.pageHeader}>
        <h1 
          className={styles.pageTitle + " bg-clip-text text-transparent"} 
          style={{ backgroundImage: getGradient() }}
        >
          Announcements
        </h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          style={{ 
            backgroundImage: getGradient(),
            color: getContrastText(colorTheme)
          }}
          className="w-full md:w-auto hover:opacity-90 transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Announcement
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colorTheme }}></div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No announcements yet. Create your first announcement!</p>
        </div>
      ) : (
        <div className={styles.contentGrid}>
          {announcements.map((announcement) => (
            <Card 
              key={announcement.id} 
              className={styles.card}
              style={{ borderColor: adjustColor(colorTheme, 0, 0.1) }}
            >
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
              <CardFooter className={`flex justify-end gap-2 border-t p-4 ${styles.buttonGroup}`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(announcement)}
                  style={{ 
                    color: colorTheme,
                    borderColor: adjustColor(colorTheme, 0, 0.5),
                    backgroundColor: adjustColor(colorTheme, 0, 0.1)
                  }}
                  className="hover:opacity-80 transition-all"
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className={styles.modalContent}>
          <DialogHeader>
            <DialogTitle>Add New Announcement</DialogTitle>
            <DialogDescription>Create a new announcement to share with your users.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAnnouncement} className={styles.formGroup}>
            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Announcement title"
                  required
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Announcement content..."
                  className="min-h-[120px]"
                  required
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <Label htmlFor="image">Image (Optional)</Label>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {imagePreview && (
                    <div className="relative h-16 w-16 rounded overflow-hidden shrink-0">
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
            <DialogFooter className={styles.buttonGroup}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                style={{ 
                  backgroundImage: getGradient(),
                  color: getContrastText(colorTheme)
                }}
                className="hover:opacity-90 transition-all"
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className={styles.modalContent}>
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>Update the announcement details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditAnnouncement} className={styles.formGroup}>
            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Announcement title"
                  required
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <Label htmlFor="edit-body">Body</Label>
                <Textarea
                  id="edit-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Announcement content..."
                  className="min-h-[120px]"
                  required
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <Label htmlFor="edit-image">Image (Optional)</Label>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {imagePreview && (
                    <div className="relative h-16 w-16 rounded overflow-hidden shrink-0">
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
            <DialogFooter className={styles.buttonGroup}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                style={{ 
                  backgroundImage: getGradient(),
                  color: getContrastText(colorTheme)
                }}
                className="hover:opacity-90 transition-all"
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
