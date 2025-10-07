'use client'

import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'

interface MenuItemCardProps {
  item: {
    id: string
    name: string
    description?: string | null
    price: number
    image?: string | null
    isAvailable: boolean
  }
  onAddToCart?: (itemId: string) => void
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
          alt={item.name}
          fill
          className="object-cover"
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Unavailable</Badge>
          </div>
        )}
      </div>
      <CardContent className="flex-1 p-4">
        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {item.description}
        </p>
        <p className="text-lg font-bold text-primary">
          {formatCurrency(item.price)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={!item.isAvailable}
          onClick={() => onAddToCart?.(item.id)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}