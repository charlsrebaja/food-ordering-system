import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { RestaurantsTable } from './restaurants-table'

async function getRestaurants() {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          menuItems: true,
          orders: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return restaurants
}

async function getUsers() {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { role: 'ADMIN' },
        { role: 'STAFF' },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  })

  return users
}

export default async function AdminRestaurantsPage() {
  const [restaurants, users] = await Promise.all([
    getRestaurants(),
    getUsers(),
  ])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Restaurants</h1>
          <p className="text-muted-foreground">
            Manage all restaurants on your platform
          </p>
        </div>
        <Link href="/admin/restaurants/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Restaurant
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Restaurants ({restaurants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <RestaurantsTable restaurants={restaurants} users={users} />
        </CardContent>
      </Card>
    </div>
  )
}