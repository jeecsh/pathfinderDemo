"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MobileUser } from "./user-managment"

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).min(1, {
    message: "Email is required",
  }),
  role: z.string().optional(),
  notification_enabled: z.boolean(),
})

export function EditMobileUserDialog({
  open,
  onOpenChange,
  onUpdateUser,
  onDeleteUser,
  user,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateUser: (user: z.infer<typeof formSchema>) => void
  onDeleteUser: (email: string) => void
  user: MobileUser | null
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      notification_enabled: false,
    },
  })

  // Reset form with user data when dialog opens or user changes
  useEffect(() => {
    if (open && user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role || "",
        notification_enabled: user.notification_enabled,
      });
    }
  }, [open, user, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdateUser({
      ...values,
      email: user?.email || "", // Use original email for identification
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Mobile User</DialogTitle>
          <DialogDescription>
            Update the mobile user&apos;s information.
          </DialogDescription>
        </DialogHeader>
        {user && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Driver, Manager, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notification_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enable Notifications</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this user?")) {
                      onDeleteUser(user.email);
                    }
                  }}
                >
                  Delete User
                </Button>
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
