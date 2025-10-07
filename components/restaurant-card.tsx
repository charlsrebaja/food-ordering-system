import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin } from 'lucide-react'

interface RestaurantCardProps {
  restaurant: {
    id: string
    name: string
    description?: string | null
    image?: string | null
    cuisine?: string | null
    location?: string | null
    isActive: boolean
  }
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative h-48 w-full">
          <Image
            src={restaurant.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5'}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
          {!restaurant.isActive && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Closed</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {restaurant.description}
          </p>
          {restaurant.cuisine && (
            <Badge variant="secondary" className="mb-2">
              {restaurant.cuisine}
            </Badge>
          )}
        </CardContent>
        {restaurant.location && (
          <CardFooter className="px-4 pb-4 pt-0">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {restaurant.location}
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}