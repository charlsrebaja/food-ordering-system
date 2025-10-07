'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
  _count: {
    orders: number
    restaurants: number
  }
}

interface UsersTableProps {
  users: User[]
}

function getRoleBadgeColor(role: string) {
  const colors = {
    ADMIN: 'bg-purple-500/10 text-purple-700',
    STAFF: 'bg-blue-500/10 text-blue-700',
    CUSTOMER: 'bg-green-500/10 text-green-700',
  }
  return colors[role as keyof typeof colors] || colors.CUSTOMER
}

export function UsersTable({ users }: UsersTableProps) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    setUpdatingId(userId)

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user role')
      }

      toast({
        title: 'Success',
        description: 'User role updated successfully',
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update role',
        variant: 'destructive',
      })
    } finally {
      setUpdatingId(null)
    }
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No users yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">User</th>
            <th className="text-left py-3 px-4 font-medium">Role</th>
            <th className="text-left py-3 px-4 font-medium">Orders</th>
            <th className="text-left py-3 px-4 font-medium">Restaurants</th>
            <th className="text-left py-3 px-4 font-medium">Joined</th>
            <th className="text-left py-3 px-4 font-medium">Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge className={getRoleBadgeColor(user.role)}>
                  {user.role}
                </Badge>
              </td>
              <td className="py-3 px-4 text-center">{user._count.orders}</td>
              <td className="py-3 px-4 text-center">{user._count.restaurants}</td>
              <td className="py-3 px-4 text-sm text-muted-foreground">
                {formatDate(user.createdAt)}
              </td>
              <td className="py-3 px-4">
                <Select
                  value={user.role}
                  onValueChange={(value) => handleRoleUpdate(user.id, value)}
                  disabled={updatingId === user.id}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}