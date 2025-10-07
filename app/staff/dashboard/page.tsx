import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { ShoppingBag, Clock, CheckCircle2, DollarSign } from 'lucide-react'

async function getStaffStats(userId: string) {
  // Get restaurants owned by this staff member
  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId: userId },
    select: { id: true },
  })

  const restaurantIds = restaurants.map(r => r.id)

  const [todayOrders, pendingOrders, totalRevenue] = await Promise.all([
    prisma.order.count({
      where: {
        restaurantId: { in: restaurantIds },
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.order.count({
      where: {
        restaurantId: { in: restaurantIds },
        status: { in: ['PENDING', 'PREPARING'] },
      },
    }),
    prisma.order.aggregate({
      where: {
        restaurantId: { in: restaurantIds },
        status: 'DELIVERED',
      },
      _sum: { total: true },
    }),
  ])

  return {
    todayOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    restaurantCount: restaurants.length,
  }
}

export default async function StaffDashboard() {
  const session = await getServerSession(authOptions)
  const stats = await getStaffStats((session?.user as any).id)

  const statCards = [
    {
      title: "Today's Orders",
      value: stats.todayOrders.toString(),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders.toString(),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'My Restaurants',
      value: stats.restaurantCount.toString(),
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Manage your restaurant orders from the Orders page
            </p>
            <a href="/staff/orders" className="text-primary hover:underline">
              Go to Orders →
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}