"use client"
import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOrgStore } from "@/app/stores/useOrgStore"
import { Input } from "@/components/ui/input"
import { DataTable } from "./data-table"
import { AddUserDialog } from "./add-user-dialog"
import { EditMobileUserDialog } from "./edit-mobile-user-dialog"
import { columns, type User } from "./columns"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Bell, BellOff } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define a type for mobile users
export type MobileUser = {
  name: string
  email: string
  role: string | null
  notification_enabled: boolean
}

// Mock data for admin users
const mockAdminUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    role: "admin",
    is_active: true,
    createdAt: "2024-01-01T12:00:00Z"
  },
  {
    id: "2",
    email: "manager@example.com",
    role: "manager",
    is_active: true,
    createdAt: "2024-02-15T09:30:00Z"
  },
  {
    id: "3",
    email: "support@example.com",
    role: "support",
    is_active: false,
    createdAt: "2024-03-10T15:45:00Z"
  }
];

// Mock data for mobile users
const mockMobileUsers: MobileUser[] = [
  {
    name: "John Doe",
    email: "john@example.com",
    role: "driver",
    notification_enabled: true
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    role: "field",
    notification_enabled: false
  },
  {
    name: "Sam Wilson",
    email: "sam@example.com",
    role: null,
    notification_enabled: true
  }
];

export function UserManagement() {
  const { colorTheme } = useOrgStore();
  const [adminUsers, setAdminUsers] = useState<User[]>([])
  const [mobileUsers, setMobileUsers] = useState<MobileUser[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditMobileUserOpen, setIsEditMobileUserOpen] = useState(false)
  const [selectedMobileUser, setSelectedMobileUser] = useState<MobileUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("admin")

  // Update active tab when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  }
  const [isMobileAppEnabled, setIsMobileAppEnabled] = useState(true)

  useEffect(() => {
    // Simulate loading data with a delay
    const timer = setTimeout(() => {
      setAdminUsers(mockAdminUsers);
      setMobileUsers(mockMobileUsers);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [])

  type NewUserData = Omit<User, "id" | "createdAt"> & {
    name?: string;
    notification_enabled?: boolean;
  };

  const handleAddUser = async (newUser: NewUserData) => {
    try {
      // Determine if we're adding a mobile user or admin user
      const isMobileUser = newUser.role === 'mobile';
      
      if (isMobileUser) {
        // Add new mobile user
        const newMobileUser: MobileUser = {
          name: newUser.name || "New User",
          email: newUser.email,
          role: null,
          notification_enabled: newUser.notification_enabled || false
        };
        
        setMobileUsers([...mobileUsers, newMobileUser]);
      } else {
        // Add new admin user
        const newAdminUser: User = {
          id: `${Date.now()}`, // Generate a unique ID
          email: newUser.email,
          role: newUser.role || "admin",
          is_active: true,
          createdAt: new Date().toISOString()
        };
        
        setAdminUsers([...adminUsers, newAdminUser]);
      }

      setIsAddUserOpen(false);
      toast.success(`${isMobileUser ? 'Mobile user' : 'User'} added successfully`);
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setAdminUsers(adminUsers.filter(user => user.id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to delete user");
    }
  };

  const handleUpdateUserStatus = async (userId: string, newStatus: boolean) => {
    try {
      setAdminUsers(adminUsers.map(user => 
        user.id === userId ? { ...user, is_active: newStatus } : user
      ));
      toast.success("User status updated successfully");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to update user status");
    }
  };

  // Filter users by search query
  const filteredAdminUsers = adminUsers.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredMobileUsers = mobileUsers.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const adminColumns = columns({
    onDelete: handleDeleteUser,
    onUpdateStatus: handleUpdateUserStatus,
  });

  const handleUpdateMobileUser = async (updatedUser: Partial<MobileUser>): Promise<boolean> => {
    try {
      if (!updatedUser.email) return false;
      
      setMobileUsers(mobileUsers.map(user => 
        user.email === updatedUser.email 
          ? { ...user, ...updatedUser }
          : user
      ));
      
      setIsEditMobileUserOpen(false);
      setSelectedMobileUser(null);
      toast.success("Mobile user updated successfully");
      return true;
    } catch (error) {
      console.error('Error updating mobile user:', error);
      toast.error('Failed to update mobile user');
      return false;
    }
  };

  const handleDeleteMobileUser = async (email: string) => {
    try {
      setMobileUsers(mobileUsers.filter(user => user.email !== email));
      setIsEditMobileUserOpen(false);
      setSelectedMobileUser(null);
      toast.success("Mobile user deleted successfully");
    } catch (error) {
      console.error('Error deleting mobile user:', error);
      toast.error('Failed to delete mobile user');
    }
  };

  const handleToggleNotifications = async (user: MobileUser, enabled: boolean) => {
    try {
      await handleUpdateMobileUser({
        email: user.email,
        notification_enabled: enabled
      });
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };

  const mobileColumns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }: { row: { original: { role: string | null } } }) => {
        // Display the actual role or 'No Role' if null
        const roleValue = row.original.role || 'No Role';
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            {roleValue}
          </span>
        );
      }
    },
    {
      accessorKey: "notification_enabled",
      header: "Notifications",
      cell: ({ row }: { row: { original: { notification_enabled: boolean } } }) => (
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs ${
            row.original.notification_enabled
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {row.original.notification_enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }: { row: { original: MobileUser } }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {
                setSelectedMobileUser(user);
                setIsEditMobileUserOpen(true);
              }}>
                Edit user
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.notification_enabled ? (
                <DropdownMenuItem onClick={() => handleToggleNotifications(user, false)}>
                  <BellOff className="mr-2 h-4 w-4" />
                  Disable notifications
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleToggleNotifications(user, true)}>
                  <Bell className="mr-2 h-4 w-4" />
                  Enable notifications
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this user?")) {
                    handleDeleteMobileUser(user.email);
                  }
                }}
              >
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-16 h-16 border-4 rounded-full animate-pulse" style={{ borderColor: `${colorTheme}33` }}></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-16 h-16 border-4 border-transparent rounded-full animate-spin" style={{ borderTopColor: colorTheme }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full transition-colors focus:outline-none"
            style={{
              '--tw-ring-color': colorTheme,
              ':hover': {
                borderColor: colorTheme,
                '--tw-ring-opacity': '0.5'
              }
            } as any}
          />
        </div>
        <Button 
          onClick={() => setIsAddUserOpen(true)}
          style={{ backgroundColor: colorTheme }}
          className="text-white"
        >
          <Plus className="mr-2 h-4 w-4 text-white" /> {activeTab === "admin" ? "Add Admin" : "Add Mobile User"}
        </Button>
      </div>

      <Tabs defaultValue="admin" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="admin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Admins ({filteredAdminUsers.length})
          </TabsTrigger>
          <TabsTrigger
            value="mobile"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            disabled={!isMobileAppEnabled}
          >
            Mobile Users ({filteredMobileUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="mt-4">
          <div className="rounded-md border">
            <DataTable
              columns={adminColumns}
              data={filteredAdminUsers}
            />
          </div>
        </TabsContent>
        {isMobileAppEnabled && (
          <TabsContent value="mobile" className="mt-4">
            <div className="rounded-md border">
              <DataTable
                columns={mobileColumns}
                data={filteredMobileUsers}
              />
            </div>
          </TabsContent>
        )}
      </Tabs>

      <AddUserDialog
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onAddUser={handleAddUser}
        defaultRole={activeTab}
      />

      <EditMobileUserDialog
        open={isEditMobileUserOpen}
        onOpenChange={setIsEditMobileUserOpen}
        onUpdateUser={handleUpdateMobileUser}
        onDeleteUser={handleDeleteMobileUser}
        user={selectedMobileUser}
      />
    </div>
  )
}