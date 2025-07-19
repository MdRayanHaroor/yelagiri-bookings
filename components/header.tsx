"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Hotels", href: "/hotels" },
  { name: "About Yelagiri", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [userSession, setUserSession] = useState<any>(null)

  useEffect(() => {
    // Check for user session
    const session = localStorage.getItem("user_session")
    if (session) {
      setUserSession(JSON.parse(session))
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("user_session")
    setUserSession(null)
    window.location.href = "/"
  }

  return (
    <header className="bg-[#003580] text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="text-lg sm:text-xl md:text-2xl font-bold truncate">
            Yelagiri Bookings
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-yellow-200 transition-colors text-sm xl:text-base whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
            <Link href="/list-property">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-[#003580] bg-transparent text-sm xl:text-base px-3 xl:px-4 whitespace-nowrap"
              >
                List Property
              </Button>
            </Link>

            {userSession ? (
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm">Hello, {userSession.full_name}</span>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-[#003580] bg-transparent text-sm xl:text-base px-3 xl:px-4 whitespace-nowrap"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-[#003580] bg-transparent text-sm xl:text-base px-3 xl:px-4 whitespace-nowrap"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="lg:hidden text-white p-2">
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Menu</h2>
              </div>
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 space-y-3">
                  <Link
                    href="/list-property"
                    className="block w-full text-center px-4 py-2 text-[#003580] border border-[#003580] rounded-md hover:bg-[#003580] hover:text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    List Your Property
                  </Link>

                  {userSession ? (
                    <div className="space-y-2">
                      <div className="text-center text-gray-700 text-sm">Hello, {userSession.full_name}</div>
                      <Button
                        onClick={() => {
                          handleSignOut()
                          setIsOpen(false)
                        }}
                        className="block w-full text-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Link
                      href="/signin"
                      className="block w-full text-center px-4 py-2 bg-[#003580] text-white rounded-md hover:bg-[#005999] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In / Register
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
