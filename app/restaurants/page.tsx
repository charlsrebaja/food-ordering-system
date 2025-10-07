import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { RestaurantCard } from '@/components/restaurant-card'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, UtensilsCrossed } from 'lucide-react'

interface RestaurantsPageProps {
  searchParams: {
    search?: string
    cuisine?: string
  }
}

async function getRestaurants(search?: string, cuisine?: string) {
  const restaurants = await prisma.restaurant.findMany({
    where: {
      isActive: true,
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }),
      ...(cuisine && {
        cuisine: {
          contains: cuisine,
          mode: 'insensitive',
        },
      }),
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return restaurants
}

async function getCuisines() {
  const restaurants = await prisma.restaurant.findMany({
    where: { isActive: true },
    select: { cuisine: true },
    distinct: ['cuisine'],
  })

  return restaurants
    .map(r => r.cuisine)
    .filter((cuisine): cuisine is string => cuisine !== null)
}

function SearchBar() {
  return (
    <form className="w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="search"
          placeholder="Search restaurants..."
          className="pl-10"
        />
      </div>
    </form>
  )
}

function EmptyState() {
  return (
    <Card className="col-span-full">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-muted p-6 mb-4">
          <UtensilsCrossed className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No restaurants found</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          We couldn&apos;t find any restaurants matching your search. Try adjusting your filters.
        </p>
      </CardContent>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="h-48 bg-muted animate-pulse" />
          <CardContent className="p-4 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function RestaurantList({ search, cuisine }: { search?: string; cuisine?: string }) {
  const restaurants = await getRestaurants(search, cuisine)

  if (restaurants.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  )
}

async function CuisineFilters() {
  const cuisines = await getCuisines()

  if (cuisines.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      <a href="/restaurants" className="px-4 py-2 rounded-full border bg-background hover:bg-accent text-sm transition-colors">
        All
      </a>
      {cuisines.map((cuisine) => (
        <a
          key={cuisine}
          href={`/restaurants?cuisine=${encodeURIComponent(cuisine)}`}
          className="px-4 py-2 rounded-full border bg-background hover:bg-accent text-sm transition-colors"
        >
          {cuisine}
        </a>
      ))}
    </div>
  )
}

export default async function RestaurantsPage({ searchParams }: RestaurantsPageProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Header */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Browse Restaurants</h1>
              <p className="text-muted-foreground text-lg mb-6">
                Discover amazing restaurants and delicious food near you
              </p>
              <SearchBar />
            </div>
            
            <div className="max-w-4xl mx-auto">
              <h3 className="text-sm font-medium mb-3">Filter by cuisine:</h3>
              <Suspense fallback={<div className="h-10 bg-muted rounded animate-pulse" />}>
                <CuisineFilters />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Restaurant Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Suspense fallback={<LoadingSkeleton />}>
              <RestaurantList search={searchParams.search} cuisine={searchParams.cuisine} />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}