"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Define the Log type
interface Log {
  id: string
  action: string
  entity: string
  entity_id: string | null
  details: Record<string, unknown> | null
  created_at: string
  user_id: string
  user_email: string
}

// Mock logs
const mockLogs: Log[] = [
  {
    id: "1",
    action: "create",
    entity: "user",
    entity_id: "123",
    details: { name: "John Doe", role: "Admin" },
    created_at: new Date().toISOString(),
    user_id: "user1",
    user_email: "john@example.com",
  },
  {
    id: "2",
    action: "update",
    entity: "announcement",
    entity_id: "456",
    details: { title: "System Maintenance", status: "Scheduled" },
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    user_id: "user2",
    user_email: "jane@example.com",
  },
  {
    id: "3",
    action: "delete",
    entity: "subscription",
    entity_id: "789",
    details: { subscriptionType: "Premium", cancelled: true },
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    user_id: "user3",
    user_email: "mike@example.com",
  },
]

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(20)

  // Filters
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [entityFilter, setEntityFilter] = useState<string>('all')
  const [userFilter, setUserFilter] = useState<string>('')

  useEffect(() => {
    filterLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, actionFilter, entityFilter, userFilter])

  const filterLogs = () => {
    let filtered = [...mockLogs]

    if (actionFilter !== "all") {
      filtered = filtered.filter(log => log.action === actionFilter)
    }

    if (entityFilter !== "all") {
      filtered = filtered.filter(log => log.entity === entityFilter)
    }

    if (userFilter.trim()) {
      filtered = filtered.filter(log => log.user_email.toLowerCase().includes(userFilter.trim().toLowerCase()))
    }

    setLogs(filtered)
  }

  const resetFilters = () => {
    setActionFilter('all')
    setEntityFilter('all')
    setUserFilter('')
    setCurrentPage(1)
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800'
      case 'update':
        return 'bg-blue-100 text-blue-800'
      case 'delete':
        return 'bg-red-100 text-red-800'
      case 'login':
        return 'bg-purple-100 text-purple-800'
      case 'logout':
        return 'bg-gray-100 text-gray-800'
      case 'enable':
        return 'bg-emerald-100 text-emerald-800'
      case 'disable':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEntityColor = (entity: string) => {
    switch (entity) {
      case 'user':
        return 'bg-indigo-100 text-indigo-800'
      case 'admin_user':
        return 'bg-purple-100 text-purple-800'
      case 'mobile_user':
        return 'bg-blue-100 text-blue-800'
      case 'announcement':
        return 'bg-amber-100 text-amber-800'
      case 'subscription':
        return 'bg-emerald-100 text-emerald-800'
      case 'setting':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDetails = (details: Record<string, unknown> | null) => {
    if (!details) return 'No details'
    try {
      if (typeof details === 'string') {
        details = JSON.parse(details) as Record<string, unknown>
      }
      return Object.entries(details as Record<string, unknown>)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(', ')
    } catch {
      return String(details)
    }
  }

  const totalPages = Math.ceil(logs.length / limit)

  const paginatedLogs = logs.slice((currentPage - 1) * limit, currentPage * limit)

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Activity Logs</h1>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter logs by action, entity, or user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="action-filter">Action</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger id="action-filter">
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="enable">Enable</SelectItem>
                  <SelectItem value="disable">Disable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entity-filter">Entity</Label>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger id="entity-filter">
                  <SelectValue placeholder="All entities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All entities</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin_user">Admin User</SelectItem>
                  <SelectItem value="mobile_user">Mobile User</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="setting">Setting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-filter">User Email</Label>
              <Input
                id="user-filter"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                placeholder="Filter by user email"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button onClick={filterLogs}>
            Apply Filters
          </Button>
        </CardFooter>
      </Card>

      {/* Logs Table */}
      {logs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No logs found matching your filters.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-lg border max-w-[calc(100vw-2rem)]">
            <div className="min-w-full overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 text-sm text-gray-500">{format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{log.user_email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getEntityColor(log.entity)}`}>
                          {log.entity.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                        {formatDetails(log.details)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
