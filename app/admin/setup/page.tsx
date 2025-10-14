"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminSetupPage() {
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const run = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`/api/admin/bootstrap`, {
        method: "POST",
        headers: {
          "x-setup-token": token,
        },
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json?.error || "Failed")
      } else {
        setResult(json)
      }
    } catch (e: any) {
      setError(e?.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Bootstrap Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the ADMIN_SETUP_TOKEN configured in your deployment environment to create or reset the admin account.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Enter ADMIN_SETUP_TOKEN"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
            />
            <Button onClick={run} disabled={loading || !token} className="bg-[#0071C2] hover:bg-[#005999]">
              {loading ? "Running..." : "Run"}
            </Button>
          </div>
          {error && <div className="text-red-600 text-sm">Error: {error}</div>}
          {result && (
            <pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
          <div className="text-sm text-gray-600">
            After success, sign in at{" "}
            <a className="underline text-[#0071C2]" href="/signin">
              /signin
            </a>{" "}
            using:
            <div className="mt-1">
              <code>admin@yelagiribookings.com</code> / <code>Admin#2025!</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
