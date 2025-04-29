"use client"
import { UserManagement } from "../components/user-managment"
import { useOrgStore } from "@/app/stores/useOrgStore"

export default function UsersPage() {
  const { colorTheme } = useOrgStore()
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 ml-6" style={{ color: colorTheme }}>Manage Users</h1>
      <UserManagement />
    </div>
  )
}
