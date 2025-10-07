'use client'

import { MenuItemCard } from '@/components/menu-item-card'
import { useCartStore } from '@/lib/store/cart-store'
import { toast } from '@/components/ui/use-toast'

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  isAvailable: boolean
  category: {
    id: string
    name: string
  }
}

interface MenuItemsGridProps {
  menuItems: MenuItem[]
  restaurantId: string
  restaurantName: string
}

function groupMenuItemsByCategory(menuItems: MenuItem[]) {
  const grouped: Record<string, MenuItem[]> = {}
  
  menuItems.forEach((item) => {
    const categoryName = item.category.name
    if (!grouped[categoryName]) {
      grouped[categoryName] = []
    }
    grouped[categoryName].push(item)
  })
  
  return grouped
}

export function MenuItemsGrid({ menuItems, restaurantId, restaurantName }: MenuItemsGridProps) {
  const addItem = useCartStore((state) => state.addItem)
  const menuByCategory = groupMenuItemsByCategory(menuItems)
  const categories = Object.keys(menuByCategory)

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId,
      restaurantName,
    })

    toast({
      title: 'Added to cart',
      description: `${item.name} has been added to your cart`,
    })
  }

  return (
    <div className="space-y-12">
      {categories.map((categoryName) => (
        <div key={categoryName}>
          <h2 className="text-2xl font-bold mb-6" id={categoryName.toLowerCase()}>
            {categoryName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuByCategory[categoryName].map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={() => handleAddToCart(item)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}