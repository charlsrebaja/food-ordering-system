"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  User,
  LogOut,
  Menu,
  Sun,
  Moon,
  UserCircle,
  ShoppingBag,
  Settings,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { CartBadge } from "@/components/cart-badge";
import { CartSidebar } from "@/components/cart-sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLoading = status === "loading";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 border-b bg-background transition-shadow duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo-fastfood.png"
                alt="FoodOrder Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
              <span className="text-2xl font-bold text-foreground hidden sm:block">
                𝓕𝓞𝓞𝓓𝓘𝓔𝓢
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/restaurants"
                className="text-sm font-medium hover:text-primary"
              >
                Restaurants
              </Link>
              {session && (
                <Link
                  href="/orders"
                  className="text-sm font-medium hover:text-primary"
                >
                  My Orders
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Cart Icon - Always Visible */}
            <CartBadge onClick={() => setCartOpen(true)} />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {session ? (
              <>
                <div className="hidden md:flex items-center gap-2">
                  {/* User Menu Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <UserCircle className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {session.user.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {session.user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          My Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders" className="cursor-pointer">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      {session.user.role === "ADMIN" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin/dashboard"
                              className="cursor-pointer"
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      {session.user.role === "STAFF" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link
                              href="/staff/dashboard"
                              className="cursor-pointer"
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Staff Dashboard
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : !isLoading ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <div className="h-10 w-20 bg-muted animate-pulse rounded" />
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              href="/restaurants"
              className="block py-2 text-sm font-medium"
            >
              Restaurants
            </Link>
            {session && (
              <>
                <Link href="/orders" className="block py-2 text-sm font-medium">
                  My Orders
                </Link>
                <Link
                  href="/profile"
                  className="block py-2 text-sm font-medium"
                >
                  Profile
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin/dashboard"
                    className="block py-2 text-sm font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {session.user.role === "STAFF" && (
                  <Link
                    href="/staff/dashboard"
                    className="block py-2 text-sm font-medium"
                  >
                    Staff Dashboard
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </>
            )}
            {!session && (
              <>
                <Link href="/login" className="block py-2">
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="block py-2">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  );
}
