import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-gray-100 pt-8 sm:pt-12 pb-6 sm:pb-8">
      <div className="container mx-auto px-4">
        {/* Newsletter Subscription */}
        <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Get the Best Yelagiri Deals!</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Subscribe to our newsletter for exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input type="email" placeholder="Your email address" className="flex-1 text-sm sm:text-base" />
            <Button className="bg-[#0071C2] hover:bg-[#005999] text-white text-sm sm:text-base px-4 sm:px-6 whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">About Us</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  About Yelagiri Bookings
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  How We Work
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Press Center
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Partner With Us</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Partner Help
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Advertise with Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Safety Resource Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Cancellation Options
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Policies</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Content Policies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-4 sm:space-x-6 mb-6 sm:mb-8">
          <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="sr-only">Instagram</span>
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs sm:text-sm text-gray-600">
          <p>Copyright © {new Date().getFullYear()} Yelagiri Bookings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
