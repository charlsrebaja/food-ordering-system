'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Edit, Trash2, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  isAvailable: boolean
  restaurant: {
    name: string
  }
  category: {
    name: string
  }
}

interface MenuItemsTableProps {
  menuItems: MenuItem[]
  restaurants: Array<{ id: string; name: string }>
  categories: Array<{ id: string; name: string }>
}

export function MenuItemsTable({ menuItems, restaurants, categories }: MenuItemsTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    setDeletingId(id)

    try {
      const response = await fetch(`/api/admin/menu-items/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete menu item')
      }

      toast({
        title: 'Success',
        description: 'Menu item deleted successfully',
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete menu item',
        variant: 'destructive',
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleAvailable = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/menu-items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update menu item')
      }

      toast({
        title: 'Success',
        description: `Menu item ${!currentStatus ? 'enabled' : 'disabled'}`,
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update menu item',
        variant: 'destructive',
      })
    }
  }

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No menu items yet</p>
        <Link href="/admin/menu-items/new">
          <Button>Add Your First Menu Item</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">Item</th>
            <th className="text-left py-3 px-4 font-medium">Restaurant</th>
            <th className="text-left py-3 px-4 font-medium">Category</th>
            <th className="text-left py-3 px-4 font-medium">Price</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
            <th className="text-right py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item) => (
            <tr key={item.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-sm">{item.restaurant.name}</td>
              <td className="py-3 px-4">
                <Badge variant="outline">{item.category.name}</Badge>
              </td>
              <td className="py-3 px-4 font-bold">{formatCurrency(item.price)}</td>
              <td className="py-3 px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleAvailable(item.id, item.isAvailable)}
                >
                  <Badge
                    variant={item.isAvailable ? 'default' : 'secondary'}
                    className={item.isAvailable ? 'bg-green-500' : ''}
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </Button>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/menu-items/${item.id}`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id, item.name)}
                    disabled={deletingId === item.id}
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