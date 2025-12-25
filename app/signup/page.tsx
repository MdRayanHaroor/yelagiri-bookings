"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { AlertCircle } from "lucide-react"

export default function SignUpPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: "user", // Default role
                    },
                },
            })

            if (signUpError) {
                setError(signUpError.message)
                return
            }

            setSuccess(true)
            // Optional: Auto-signin or redirect
        } catch (err: any) {
            setError(err?.message || "Failed to sign up")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow flex items-center justify-center py-12 px-4">
                    <Card className="w-full max-w-md text-center">
                        <CardHeader>
                            <CardTitle className="text-2xl text-green-600">Success!</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-600">
                                Please check your email to confirm your account.
                            </p>
                            <Button asChild className="w-full bg-[#0071C2]">
                                <Link href="/signin">Return to Sign In</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow flex items-center justify-center py-12 px-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl">Create Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSignUp} className="space-y-4">
                            {error && (
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800 ml-2">{error}</AlertDescription>
                                </Alert>
                            )}

                            <div>
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                    required
                                    minLength={6}
                                    disabled={loading}
                                />
                            </div>

                            <Button type="submit" className="w-full bg-[#0071C2] hover:bg-[#005999]" disabled={loading}>
                                {loading ? "Creating account..." : "Sign Up"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link href="/signin" className="text-[#0071C2] hover:underline font-semibold">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
