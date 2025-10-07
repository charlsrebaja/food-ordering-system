import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, cn } from '@/lib/utils'
import {
  ShoppingBag,
  DollarSign,
  Store,
  Users,
  TrendingUp,
  Package,
  UtensilsCrossed
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

async function getDashboardStats() {
  const [
    totalOrders,
    totalRevenue,
    totalRestaurants,
    totalUsers,
    recentOrders,
    ordersByStatus,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
    }),
    prisma.restaurant.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.findMany({
      take: 5,
      include: {
        user: true,
        restaurant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: true,
    }),
  ])

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    totalRestaurants,
    totalUsers,
    recentOrders,
    ordersByStatus,
  }
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

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Restaurants',
      value: stats.totalRestaurants.toString(),
      icon: Store,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Customers',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
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
                <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                  <Icon className={cn('h-4 w-4', stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{order.user.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {order.restaurant.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('px-2 py-1 rounded-md text-xs font-medium', getStatusColor(order.status))}>
                      {order.status}
                    </span>
                    <span className="font-bold">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              ))}
              {stats.recentOrders.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Orders by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.ordersByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('h-3 w-3 rounded-full', getStatusColor(item.status))} />
                    <span className="font-medium">{item.status}</span>
                  </div>
                  <span className="text-2xl font-bold">{item._count}</span>
                </div>
              ))}
              {stats.ordersByStatus.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No orders yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/admin/restaurants">
              <Button variant="outline" className="w-full justify-start">
                <Store className="mr-2 h-4 w-4" />
                Add Restaurant
              </Button>
            </Link>
            <Link href="/admin/menu-items">
              <Button variant="outline" className="w-full justify-start">
                <UtensilsCrossed className="mr-2 h-4 w-4" />
                Add Menu Item
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full justify-start">
                <ShoppingBag className="mr-2 h-4 w-4" />
                View Orders
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
