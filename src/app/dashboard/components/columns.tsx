"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, UserCheck, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger,} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

export type User = {
  id: string
  email: string
  role: "admin" | "mobile" | "manager" | "support"
  is_active: boolean
  createdAt: string
}

interface ColumnOptions {
  onDelete: (userId: string) => void
  onUpdateStatus: (userId: string, status: boolean) => void
}

export const columns = ({ onDelete, onUpdateStatus }: ColumnOptions): ColumnDef<User>[] => [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("is_active") as boolean

      return (
        <Badge variant={status ? "default" : "destructive"}>
          {status ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copy user ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onUpdateStatus(user.id, true)}>
                <UserCheck className="mr-2 h-4 w-4" />
                Set as active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(user.id, false)}>
                <UserX className="mr-2 h-4 w-4" />
                Set as inactive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive">Delete user</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user account and remove their data from
                our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(user.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    },
  },
]
