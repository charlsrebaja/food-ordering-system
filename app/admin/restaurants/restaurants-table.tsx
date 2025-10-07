'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

interface Restaurant {
  id: string
  name: string
  description: string | null
  cuisine: string | null
  location: string | null
  isActive: boolean
  owner: {
    name: string
    email: string
  }
  _count: {
    menuItems: number
    orders: number
  }
}

interface RestaurantsTableProps {
  restaurants: Restaurant[]
  users: Array<{ id: string; name: string; email: string; role: string }>
}

export function RestaurantsTable({ restaurants, users }: RestaurantsTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all associated menu items.`)) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetch(`/api/admin/restaurants/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete restaurant')
      }

      toast({
        title: 'Success',
        description: 'Restaurant deleted successfully',
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete restaurant',
        variant: 'destructive',
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/restaurants/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update restaurant')
      }

      toast({
        title: 'Success',
        description: `Restaurant ${!currentStatus ? 'activated' : 'deactivated'}`,
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update restaurant',
        variant: 'destructive',
      })
    }
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No restaurants yet</p>
        <Link href="/admin/restaurants/new">
          <Button>Add Your First Restaurant</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">Restaurant</th>
            <th className="text-left py-3 px-4 font-medium">Owner</th>
            <th className="text-left py-3 px-4 font-medium">Cuisine</th>
            <th className="text-left py-3 px-4 font-medium">Location</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
            <th className="text-left py-3 px-4 font-medium">Menu Items</th>
            <th className="text-left py-3 px-4 font-medium">Orders</th>
            <th className="text-right py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant) => (
            <tr key={restaurant.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium">{restaurant.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {restaurant.description}
                  </p>
                </div>
              </td>
              <td className="py-3 px-4">
                <div>
                  <p className="text-sm">{restaurant.owner.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {restaurant.owner.email}
                  </p>
                </div>
              </td>
              <td className="py-3 px-4">
                {restaurant.cuisine && (
                  <Badge variant="outline">{restaurant.cuisine}</Badge>
                )}
              </td>
              <td className="py-3 px-4 text-sm">{restaurant.location}</td>
              <td className="py-3 px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleActive(restaurant.id, restaurant.isActive)}
                >
                  <Badge
                    variant={restaurant.isActive ? 'default' : 'secondary'}
                    className={restaurant.isActive ? 'bg-green-500' : ''}
                  >
                    {restaurant.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Button>
              </td>
              <td className="py-3 px-4 text-center">
                {restaurant._count.menuItems}
              </td>
              <td className="py-3 px-4 text-center">
                {restaurant._count.orders}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/restaurant/${restaurant.id}`} target="_blank">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/restaurants/${restaurant.id}`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(restaurant.id, restaurant.name)}
                    disabled={deletingId === restaurant.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}