"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// UI components
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.string().min(1, {
    message: "Please select a role.",
  }),
  is_active: z.boolean(),
  name: z.string().optional(),
  mobile_role: z.string().optional(),
  notification_enabled: z.boolean().optional(),
})

export function AddUserDialog({
  open,
  onOpenChange,
  onAddUser,
  defaultRole = "admin"
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAddUser: (user: any) => void
  defaultRole?: string
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: defaultRole,
      is_active: true,
      name: "",
      mobile_role: "",
      notification_enabled: false,
    },
  })

  // Reset form with appropriate defaults when dialog opens or defaultRole changes
  useEffect(() => {
    if (open) {
      form.reset({
        email: "",
        role: defaultRole,
        is_active: true,
        name: "",
        mobile_role: "",
        notification_enabled: false,
      });
    }
  }, [open, defaultRole, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddUser(values)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultRole === "admin" ? "Add Admin" : "Add Mobile User"}</DialogTitle>
          <DialogDescription>
            {defaultRole === "admin"
              ? "Add a new admin user to the system. They will receive an email invitation."
              : "Add a new mobile user who can access the mobile application."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {defaultRole === "admin" ? (
              // For admin users, set hidden inputs with role="admin" and is_active=true
              <>
                <input type="hidden" {...form.register("role")} value="admin" />
                <input type="hidden" {...form.register("is_active")} value="true" />
              </>
            ) : (
              // For mobile users, show name and role as string input
              <>
                <input type="hidden" {...form.register("role")} value="mobile" />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="User's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile_role"
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
              </>
            )}
            <DialogFooter>
              <Button type="submit">Add User</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
