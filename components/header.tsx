"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, LogOut, Shield, Building } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasProperties, setHasProperties] = useState(false)
  const [checkingProperties, setCheckingProperties] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          return
        }

        if (mounted) {
          setUser(session?.user ?? null)
          if (session?.user) {
            await checkUserProperties(session.user.id)
          }
          setLoading(false)
        }
      } catch (err) {
        console.error("Error in getInitialSession:", err)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setUser(session?.user ?? null)

        if (event === "SIGNED_OUT") {
          setHasProperties(false)
          setLoading(false)
        } else if (session?.user) {
          await checkUserProperties(session.user.id)
          setLoading(false)
        } else {
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const checkUserProperties = async (userId: string) => {
    setCheckingProperties(true)
    try {
      const { data, error } = await supabase
        .from("hotels")
        .select("id", { count: "exact" })
        .eq("owner_id", userId)
        .limit(1)

      if (error) {
        console.error("Error checking properties:", error)
        setHasProperties(false)
      } else {
        setHasProperties(data && data.length > 0)
      }
    } catch (err) {
      console.error("Error checking properties:", err)
      setHasProperties(false)
    } finally {
      setCheckingProperties(false)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Sign out error:", error)
        alert("Error signing out. Please try again.")
        setIsSigningOut(false)
        return
      }

      // Clear local state
      setUser(null)
      setHasProperties(false)

      // Clear session storage for bookings
      sessionStorage.removeItem("bookingData")

      // Redirect to home
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("Unexpected error during sign out:", err)
      alert("Unexpected error. Please try again.")
      setIsSigningOut(false)
    }
  }

  const handlePropertyButtonClick = async () => {
    if (!user) {
      router.push("/signin?redirect=/list-property")
      return
    }

    if (hasProperties) {
      router.push("/my-property")
    } else {
      router.push("/list-property")
    }
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Hotels", href: "/hotels" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const isAdmin = user?.user_metadata?.role === "admin"

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#0071C2] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">YB</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Yelagiri Bookings</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-[#0071C2] font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-gray-600 hover:text-[#0071C2] font-medium transition-colors flex items-center gap-1"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded" />
            ) : user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user.user_metadata?.full_name || user.email}</span>
                </div>
                <Button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1 bg-transparent hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
                </Button>
              </div>
            ) : (
              <Button asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
            )}

            {checkingProperties ? (
              <div className="w-32 h-9 bg-gray-200 animate-pulse rounded" />
            ) : (
              <Button
                onClick={handlePropertyButtonClick}
                variant="outline"
                className="flex items-center gap-2 bg-transparent hover:bg-blue-50 hover:text-[#0071C2]"
              >
                <Building className="h-4 w-4" />
                {user && hasProperties ? "My Property" : "List Property"}
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-[#0071C2] font-medium py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-gray-600 hover:text-[#0071C2] font-medium py-2 flex items-center gap-1"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                <div className="border-t pt-4 space-y-2">
                  {loading ? (
                    <div className="w-full h-8 bg-gray-200 animate-pulse rounded" />
                  ) : user ? (
                    <>
                      <div className="text-sm text-gray-600 py-2">Signed in as {user.email}</div>
                      <Button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-transparent hover:bg-red-50 hover:text-red-600"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {isSigningOut ? "Signing out..." : "Sign Out"}
                      </Button>
                    </>
                  ) : (
                    <Button asChild className="w-full">
                      <Link href="/signin">Sign In</Link>
                    </Button>
                  )}

                  {checkingProperties ? (
                    <div className="w-full h-8 bg-gray-200 animate-pulse rounded" />
                  ) : (
                    <Button
                      onClick={handlePropertyButtonClick}
                      variant="outline"
                      className="w-full justify-start bg-transparent hover:bg-blue-50 hover:text-[#0071C2]"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      {user && hasProperties ? "My Property" : "List Property"}
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
