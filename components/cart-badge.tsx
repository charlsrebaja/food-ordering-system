'use client'

import { useCartStore } from '@/lib/store/cart-store'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CartBadgeProps {
  onClick: () => void
}

export function CartBadge({ onClick }: CartBadgeProps) {
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative hover:scale-110 transition-transform duration-200"
      onClick={onClick}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold animate-in zoom-in-50">
          {itemCount}
        </span>
      )}
    </Button>
  )
}