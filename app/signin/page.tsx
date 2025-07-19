"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface SignInFormData {
  email: string
  phone: string
  password: string
}

interface SignUpFormData {
  full_name: string
  email: string
  phone: string
  password: string
  confirm_password: string
}

export default function SignInPage() {
  const [activeTab, setActiveTab] = useState("signin")
  const [signInMethod, setSignInMethod] = useState<"email" | "phone">("email")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [signInData, setSignInData] = useState<SignInFormData>({
    email: "",
    phone: "",
    password: "",
  })

  const [signUpData, setSignUpData] = useState<SignUpFormData>({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  })

  const [errors, setErrors] = useState<string[]>([])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
    return phoneRegex.test(phone.replace(/\s+/g, ""))
  }

  const validateSignIn = () => {
    const newErrors: string[] = []

    if (signInMethod === "email") {
      if (!signInData.email.trim()) newErrors.push("Email is required")
      else if (!validateEmail(signInData.email)) newErrors.push("Please enter a valid email address")
    } else {
      if (!signInData.phone.trim()) newErrors.push("Phone number is required")
      else if (!validatePhone(signInData.phone)) newErrors.push("Please enter a valid Indian phone number")
    }

    if (!signInData.password.trim()) newErrors.push("Password is required")

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const validateSignUp = () => {
    const newErrors: string[] = []

    if (!signUpData.full_name.trim()) newErrors.push("Full name is required")
    if (!signUpData.email.trim()) newErrors.push("Email is required")
    else if (!validateEmail(signUpData.email)) newErrors.push("Please enter a valid email address")
    if (!signUpData.phone.trim()) newErrors.push("Phone number is required")
    else if (!validatePhone(signUpData.phone)) newErrors.push("Please enter a valid Indian phone number")
    if (!signUpData.password.trim()) newErrors.push("Password is required")
    else if (signUpData.password.length < 6) newErrors.push("Password must be at least 6 characters long")
    if (signUpData.password !== signUpData.confirm_password) newErrors.push("Passwords do not match")

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSignIn()) return

    setLoading(true)
    try {
      // Check if user exists in our users table
      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("*")
        .or(signInMethod === "email" ? `email.eq.${signInData.email}` : `phone.eq.${signInData.phone}`)
        .single()

      if (userError || !existingUser) {
        setErrors(["User not found. Please register first."])
        return
      }

      // In a real app, you'd verify the password here
      // For demo purposes, we'll just check if password is not empty
      if (signInData.password.length < 1) {
        setErrors(["Invalid password"])
        return
      }

      // Store user session (in a real app, use proper authentication)
      localStorage.setItem(
        "user_session",
        JSON.stringify({
          id: existingUser.id,
          email: existingUser.email,
          full_name: existingUser.full_name,
          role: existingUser.role,
        }),
      )

      alert("Sign in successful!")
      window.location.href = "/"
    } catch (error) {
      console.error("Sign in error:", error)
      setErrors(["An error occurred during sign in. Please try again."])
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSignUp()) return

    setLoading(true)
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .or(`email.eq.${signUpData.email},phone.eq.${signUpData.phone}`)
        .single()

      if (existingUser) {
        setErrors(["User with this email or phone already exists. Please sign in instead."])
        return
      }

      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            full_name: signUpData.full_name,
            email: signUpData.email,
            phone: signUpData.phone,
            role: "guest",
            is_verified: false,
          },
        ])
        .select()
        .single()

      if (insertError) {
        console.error("Insert error:", insertError)
        setErrors(["Failed to create account. Please try again."])
        return
      }

      // Store user session
      localStorage.setItem(
        "user_session",
        JSON.stringify({
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role,
        }),
      )

      alert("Account created successfully!")
      window.location.href = "/"
    } catch (error) {
      console.error("Sign up error:", error)
      setErrors(["An error occurred during registration. Please try again."])
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    alert("Google Sign In will be implemented with proper OAuth integration")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Welcome to Yelagiri Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  {/* Google Sign In */}
                  <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full bg-transparent"
                    type="button"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  {/* Sign In Method Selection */}
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={signInMethod === "email" ? "default" : "outline"}
                      onClick={() => setSignInMethod("email")}
                      className="flex-1"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      type="button"
                      variant={signInMethod === "phone" ? "default" : "outline"}
                      onClick={() => setSignInMethod("phone")}
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </Button>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-4">
                    {signInMethod === "email" ? (
                      <div>
                        <Label htmlFor="signin-email">Email</Label>
                        <Input
                          id="signin-email"
                          type="email"
                          value={signInData.email}
                          onChange={(e) => setSignInData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="signin-phone">Phone Number</Label>
                        <Input
                          id="signin-phone"
                          type="tel"
                          value={signInData.phone}
                          onChange={(e) => setSignInData((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          value={signInData.password}
                          onChange={(e) => setSignInData((prev) => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter your password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {errors.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <ul className="text-red-700 text-sm space-y-1">
                          {errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button type="submit" className="w-full bg-[#0071C2] hover:bg-[#005999]" disabled={loading}>
                      {loading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>

                  <div className="text-center">
                    <Button variant="link" className="text-sm">
                      Forgot your password?
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  {/* Google Sign Up */}
                  <Button
                    onClick={handleGoogleSignIn}
                    variant="outline"
                    className="w-full bg-transparent"
                    type="button"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or register with</span>
                    </div>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        value={signUpData.full_name}
                        onChange={(e) => setSignUpData((prev) => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="signup-phone">Phone Number</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          value={signUpData.password}
                          onChange={(e) => setSignUpData((prev) => ({ ...prev, password: e.target.value }))}
                          placeholder="Create a password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={signUpData.confirm_password}
                          onChange={(e) => setSignUpData((prev) => ({ ...prev, confirm_password: e.target.value }))}
                          placeholder="Confirm your password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {errors.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        <ul className="text-red-700 text-sm space-y-1">
                          {errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button type="submit" className="w-full bg-[#0071C2] hover:bg-[#005999]" disabled={loading}>
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>

                  <div className="text-center text-sm text-gray-600">
                    By creating an account, you agree to our{" "}
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Privacy Policy
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
