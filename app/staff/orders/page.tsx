import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StaffOrdersTable } from './staff-orders-table'

async function getStaffOrders(userId: string) {
  // Get restaurants owned by this staff member
  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId: userId },
    select: { id: true },
  })

  const restaurantIds = restaurants.map(r => r.id)

  // Get orders for those restaurants
  const orders = await prisma.order.findMany({
    where: {
      restaurantId: { in: restaurantIds },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      restaurant: {
        select: {
          name: true,
        },
      },
      orderItems: {
        include: {
          menuItem: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return orders
}

export default async function StaffOrdersPage() {
  const session = await getServerSession(authOptions)
  const orders = await getStaffOrders((session?.user as any).id)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-muted-foreground">
          Manage orders for your restaurants
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <StaffOrdersTable orders={orders} />
        </CardContent>
      </Card>
    </div>
  )
}