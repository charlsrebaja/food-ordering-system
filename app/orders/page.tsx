import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Package, Clock } from 'lucide-react'

async function getOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      restaurant: true,
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

function getStatusColor(status: string) {
  const colors = {
    PENDING: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    PREPARING: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    READY: 'bg-green-500/10 text-green-700 dark:text-green-400',
    DELIVERED: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
    CANCELLED: 'bg-red-500/10 text-red-700 dark:text-red-400',
  }
  return colors[status as keyof typeof colors] || colors.PENDING
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/orders')
  }

  const orders = await getOrders((session.user as any).id)

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            {orders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                  <p className="text-muted-foreground text-center mb-6">
                    When you place orders, they will appear here
                  </p>
                  <Link href="/restaurants">
                    <Badge className="cursor-pointer">Browse Restaurants</Badge>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link key={order.id} href={`/orders/${order.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">
                                {order.restaurant.name}
                              </h3>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              {formatCurrency(order.total)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.orderItems.length} item
                              {order.orderItems.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          {order.orderItems.slice(0, 2).map((item) => (
                            <div
                              key={item.id}
                              className="text-sm text-muted-foreground"
                            >
                              {item.quantity}x {item.menuItem.name}
                            </div>
                          ))}
                          {order.orderItems.length > 2 && (
                            <div className="text-sm text-muted-foreground">
                              +{order.orderItems.length - 2} more items
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}