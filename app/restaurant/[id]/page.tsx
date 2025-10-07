import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock, Star } from 'lucide-react'
import { MenuItemsGrid } from './menu-items-grid'

interface RestaurantPageProps {
  params: {
    id: string
  }
}

async function getRestaurant(id: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      menuItems: {
        where: { isAvailable: true },
        include: {
          category: true,
        },
        orderBy: {
          name: 'asc',
        },
      },
    },
  })

  return restaurant
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const restaurant = await getRestaurant(params.id)

  if (!restaurant) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Restaurant Header */}
        <section className="relative">
          {/* Banner Image */}
          <div className="relative h-64 md:h-80 w-full">
            <Image
              src={restaurant.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5'}
              alt={restaurant.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>

          {/* Restaurant Info */}
          <div className="container mx-auto px-4 -mt-16 relative">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                      {!restaurant.isActive && (
                        <Badge variant="destructive">Closed</Badge>
                      )}
                      {restaurant.isActive && (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                          Open
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-4">
                      {restaurant.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      {restaurant.cuisine && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{restaurant.cuisine}</Badge>
                        </div>
                      )}
                      {restaurant.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {restaurant.location}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        30-45 min
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        4.5
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Menu Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {restaurant.menuItems.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-muted-foreground text-center">
                    No menu items available at the moment
                  </p>
                </CardContent>
              </Card>
            ) : (
              <MenuItemsGrid
                menuItems={restaurant.menuItems}
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
              />
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}