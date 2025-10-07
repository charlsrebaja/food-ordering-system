'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Store, 
  UtensilsCrossed, 
  ShoppingBag, 
  Users, 
  Home,
  LogOut
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Restaurants',
    href: '/admin/restaurants',
    icon: Store,
  },
  {
    title: 'Menu Items',
    href: '/admin/menu-items',
    icon: UtensilsCrossed,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-background flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">Manage your platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t space-y-2">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Back to Site
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}