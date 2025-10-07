'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Order {
  id: string
  total: number
  status: string
  createdAt: Date
  user: {
    name: string
    email: string
  }
  restaurant: {
    name: string
  }
  orderItems: Array<{
    id: string
    quantity: number
    menuItem: {
      name: string
    }
  }>
}

interface StaffOrdersTableProps {
  orders: Order[]
}

function getStatusColor(status: string) {
  const colors = {
    PENDING: 'bg-yellow-500/10 text-yellow-700',
    PREPARING: 'bg-blue-500/10 text-blue-700',
    READY: 'bg-green-500/10 text-green-700',
    DELIVERED: 'bg-gray-500/10 text-gray-700',
    CANCELLED: 'bg-red-500/10 text-red-700',
  }
  return colors[status as keyof typeof colors] || colors.PENDING
}

export function StaffOrdersTable({ orders }: StaffOrdersTableProps) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId)

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive',
      })
    } finally {
      setUpdatingId(null)
    }
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No orders for your restaurants yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">Order ID</th>
            <th className="text-left py-3 px-4 font-medium">Customer</th>
            <th className="text-left py-3 px-4 font-medium">Restaurant</th>
            <th className="text-left py-3 px-4 font-medium">Items</th>
            <th className="text-left py-3 px-4 font-medium">Total</th>
            <th className="text-left py-3 px-4 font-medium">Date</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
            <th className="text-left py-3 px-4 font-medium">Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-4">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {order.id.slice(0, 8)}
                </code>
              </td>
              <td className="py-3 px-4">
                <div>
                  <p className="text-sm font-medium">{order.user.name}</p>
                  <p className="text-xs text-muted-foreground">{order.user.email}</p>
                </div>
              </td>
              <td className="py-3 px-4 text-sm">{order.restaurant.name}</td>
              <td className="py-3 px-4">
                <div className="text-sm">
                  {order.orderItems.slice(0, 2).map((item, idx) => (
                    <div key={item.id} className="text-muted-foreground">
                      {item.quantity}x {item.menuItem.name}
                    </div>
                  ))}
                  {order.orderItems.length > 2 && (
                    <div className="text-muted-foreground text-xs">
                      +{order.orderItems.length - 2} more
                    </div>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 font-bold">{formatCurrency(order.total)}</td>
              <td className="py-3 px-4 text-sm text-muted-foreground">
                {formatDate(order.createdAt)}
              </td>
              <td className="py-3 px-4">
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <Select
                  value={order.status}
                  onValueChange={(value) => handleStatusUpdate(order.id, value)}
                  disabled={updatingId === order.id}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PREPARING">Preparing</SelectItem>
                    <SelectItem value="READY">Ready</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
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