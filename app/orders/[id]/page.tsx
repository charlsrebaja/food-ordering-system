import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Package, MapPin, Clock, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface OrderPageProps {
  params: {
    id: string
  }
}

async function getOrder(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      restaurant: true,
      orderItems: {
        include: {
          menuItem: true,
        },
      },
    },
  })

  if (!order || order.userId !== userId) {
    return null
  }

  return order
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

export default async function OrderDetailsPage({ params }: OrderPageProps) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/login')
  }

  const order = await getOrder(params.id, (session.user as any).id)

  if (!order) {
    notFound()
  }

  const statusSteps = [
    { status: 'PENDING', label: 'Order Placed', icon: Package },
    { status: 'PREPARING', label: 'Preparing', icon: Clock },
    { status: 'READY', label: 'Ready', icon: CheckCircle2 },
    { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
  ]

  const currentStatusIndex = statusSteps.findIndex((step) => step.status === order.status)

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Order Details</h1>
                <p className="text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
              </div>
              <Link href="/orders">
                <Button variant="outline">Back to Orders</Button>
              </Link>
            </div>

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order Status</CardTitle>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between relative">
                  {statusSteps.map((step, index) => {
                    const StepIcon = step.icon
                    const isCompleted = index <= currentStatusIndex
                    const isLast = index === statusSteps.length - 1

                    return (
                      <div key={step.status} className="flex-1 relative">
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${
                              isCompleted
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            <StepIcon className="h-6 w-6" />
                          </div>
                          <p className="text-xs text-center font-medium">{step.label}</p>
                        </div>
                        {!isLast && (
                          <div
                            className={`absolute top-6 left-1/2 w-full h-0.5 ${
                              index < currentStatusIndex ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Items */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                          {item.menuItem.image ? (
                            <Image
                              src={item.menuItem.image}
                              alt={item.menuItem.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1">{item.menuItem.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-primary">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatCurrency(order.total - 5)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery</span>
                        <span>{formatCurrency(5)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Restaurant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold mb-1">{order.restaurant.name}</p>
                    {order.restaurant.location && (
                      <p className="text-sm text-muted-foreground">
                        {order.restaurant.location}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Order Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{formatDate(order.createdAt)}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}