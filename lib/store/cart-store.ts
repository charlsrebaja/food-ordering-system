import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
  image: string | null
  restaurantId: string
  restaurantName: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void
  removeItem: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  getRestaurantId: () => string | null
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const restaurantId = get().getRestaurantId()

        // Check if adding from different restaurant
        if (restaurantId && restaurantId !== item.restaurantId) {
          // Clear cart if different restaurant
          if (confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
            set({
              items: [{ ...item, id: crypto.randomUUID(), quantity: 1 }],
            })
          }
          return
        }

        // Check if item already exists
        const existingItem = items.find((i) => i.menuItemId === item.menuItemId)

        if (existingItem) {
          // Update quantity
          set({
            items: items.map((i) =>
              i.menuItemId === item.menuItemId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
        } else {
          // Add new item
          set({
            items: [...items, { ...item, id: crypto.randomUUID(), quantity: 1 }],
          })
        }
      },

      removeItem: (menuItemId) => {
        set({
          items: get().items.filter((item) => item.menuItemId !== menuItemId),
        })
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId)
          return
        }

        set({
          items: get().items.map((item) =>
            item.menuItemId === menuItemId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          return total + item.price * item.quantity
        }, 0)
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },

      getRestaurantId: () => {
        const items = get().items
        return items.length > 0 ? items[0].restaurantId : null
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)