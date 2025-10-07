'use client'

import { useCartStore } from '@/lib/store/cart-store'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { Minus, Plus, Trash2, ShoppingCart as ShoppingCartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function CartPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore()

  const handleCheckout = () => {
    if (!session) {
      router.push('/login?callbackUrl=/cart')
      return
    }
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-12">
          <div className="container mx-auto px-4">
            <Card className="max-w-md mx-auto">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <ShoppingCartIcon className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground text-center mb-6">
                  Add some delicious items to get started
                </p>
                <Link href="/restaurants">
                  <Button>Browse Restaurants</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('Are you sure you want to clear your cart?')) {
                    clearCart()
                  }
                }}
              >
                Clear Cart
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ShoppingCartIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.restaurantName}
                          </p>
                          <p className="text-lg font-bold text-primary">
                            {formatCurrency(item.price)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end justify-between">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.menuItemId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1
                                updateQuantity(item.menuItemId, value)
                              }}
                              className="w-16 text-center"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <p className="text-sm font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatCurrency(getTotal())}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery Fee</span>
                        <span>{formatCurrency(5)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>{formatCurrency(getTotal() + 5)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-2">
                    <Button className="w-full" size="lg" onClick={handleCheckout}>
                      Proceed to Checkout
                    </Button>
                    <Link href="/restaurants" className="w-full">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardFooter>
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