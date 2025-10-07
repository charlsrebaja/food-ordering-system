import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { MenuItemsTable } from './menu-items-table'

async function getMenuItems() {
  const menuItems = await prisma.menuItem.findMany({
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return menuItems
}

async function getRestaurants() {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
    },
  })
  return restaurants
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  })
  return categories
}

export default async function AdminMenuItemsPage() {
  const [menuItems, restaurants, categories] = await Promise.all([
    getMenuItems(),
    getRestaurants(),
    getCategories(),
  ])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Menu Items</h1>
          <p className="text-muted-foreground">
            Manage menu items across all restaurants
          </p>
        </div>
        <Link href="/admin/menu-items/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Menu Items ({menuItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <MenuItemsTable 
            menuItems={menuItems}
            restaurants={restaurants}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  )
}