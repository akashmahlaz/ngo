"use client"

import { useState, useEffect, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { AlertCircle, Check, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

function CompleteProfileContent() {
  const { status, update } = useSession()
  const router = useRouter()
  const sp = useSearchParams()
  
  const [step, setStep] = useState<"role" | "details" | "plan">("role")
  const [role, setRole] = useState<"volunteer" | "ngo" | null>(null)
  const [orgName, setOrgName] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<"volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus" | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const plansByRole: Record<"volunteer" | "ngo", { value: "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus"; label: string; description: string; price: string; features: string[] }[]> = {
    volunteer: [
      {
        value: "volunteer_free",
        label: "Free",
        description: "Perfect for getting started",
        price: "₹0",
        features: ["1 application per month", "Basic profile", "Job browsing"],
      },
      {
        value: "volunteer_plus",
        label: "Plus",
        description: "Unlimited access",
        price: "₹199/mo",
        features: ["Unlimited applications", "Priority support", "Advanced analytics"],
      },
    ],
    ngo: [
      {
        value: "ngo_base",
        label: "Base",
        description: "For small organizations",
        price: "₹0",
        features: ["Up to 3 active postings", "Basic dashboard", "Volunteer management"],
      },
      {
        value: "ngo_plus",
        label: "Plus",
        description: "Full platform access",
        price: "₹499/mo",
        features: ["Unlimited postings", "Advanced analytics", "Priority placement"],
      },
    ],
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin")
    }
  }, [status, router])

  // Prefill role from query param if provided (e.g., social signup selected role earlier)
  useEffect(() => {
    const r = sp?.get("role")
    if ((r === "volunteer" || r === "ngo") && role === null) {
      setRole(r)
    }
  }, [sp, role])

  useEffect(() => {
    if (role) {
      setSelectedPlan(role === "ngo" ? "ngo_base" : "volunteer_free")
    }
  }, [role])

  async function handleCompleteProfile() {
    if (!role) {
      setError("Please select a role")
      return
    }

    if (role === "ngo" && !orgName.trim()) {
      setError("Organization name is required for NGOs")
      return
    }

    if (!selectedPlan) {
      setError("Please choose a plan")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          plan: selectedPlan,
          orgName: role === "ngo" ? orgName : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to complete profile")
      }

      toast.success("Profile completed successfully!")

      // Update session
      await update()

      if (data.requiresUpgrade && data.targetPlan) {
        router.push(`/upgrade?plan=${data.targetPlan}`)
        return
      }

      // Redirect to dashboard
      const dashboardUrl = role === "ngo" ? "/(dashboard)/ngo" : "/(dashboard)/volunteer"
      router.push(dashboardUrl)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "role" && (
            <div className="space-y-4">
              <RadioGroup value={role || ""} onValueChange={(v) => setRole(v as "volunteer" | "ngo")}>
                <div
                  className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                  onClick={() => setRole("volunteer")}
                >
                  <RadioGroupItem value="volunteer" id="volunteer" />
                  <Label htmlFor="volunteer" className="cursor-pointer flex-1">
                    <div className="font-medium">I&apos;m a Volunteer</div>
                    <div className="text-sm text-muted-foreground">
                      Find and apply for volunteering opportunities
                    </div>
                  </Label>
                </div>

                <div
                  className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                  onClick={() => setRole("ngo")}
                >
                  <RadioGroupItem value="ngo" id="ngo" />
                  <Label htmlFor="ngo" className="cursor-pointer flex-1">
                    <div className="font-medium">I&apos;m from an NGO</div>
                    <div className="text-sm text-muted-foreground">
                      Post jobs and find volunteers
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              <Button onClick={() => setStep("details")} disabled={!role || loading} className="w-full">
                Continue
              </Button>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-4">
              {role === "ngo" && (
                <div className="space-y-2">
                  <Label htmlFor="org">Organization Name *</Label>
                  <Input
                    id="org"
                    placeholder="Enter your organization name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                </div>
              )}

              {role === "volunteer" && (
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <div className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">Profile info</div>
                      <div className="text-sm text-muted-foreground">
                        You can complete your full volunteer profile after signing in
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("role")} disabled={loading} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setStep("plan")}
                  disabled={!role || (role === "ngo" && !orgName.trim()) || loading}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === "plan" && role && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Choose the plan that fits you best. You can upgrade or downgrade anytime.
                </p>
              </div>

              <div className="grid gap-3">
                {plansByRole[role].map((planOption) => {
                  const isActive = selectedPlan === planOption.value
                  return (
                    <button
                      key={planOption.value}
                      type="button"
                      onClick={() => !loading && setSelectedPlan(planOption.value)}
                      className={`w-full text-left rounded-lg border-2 p-4 transition-all ${
                        isActive
                          ? "border-purple-500 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 shadow-lg"
                          : "border-muted hover:border-purple-300 dark:hover:border-purple-700"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{planOption.label}</h3>
                            {isActive && (
                              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-purple-600 to-pink-600 text-white">
                                <Check className="h-3 w-3" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{planOption.description}</p>
                        </div>
                        <p className="font-semibold text-base bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {planOption.price}
                        </p>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                        {planOption.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-1.5">
                            <Check className="h-3 w-3 text-green-600 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  )
                })}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setStep("details")} disabled={loading} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleCompleteProfile}
                  disabled={loading || !selectedPlan}
                  className="flex-1"
                >
                  {loading ? "Finishing..." : "Finish setup"}
                </Button>
              </div>

              {selectedPlan && selectedPlan.endsWith("plus") && (
                <p className="text-xs text-muted-foreground">
                  We&apos;ll guide you through secure payment on the next step to activate your Plus benefits.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <CompleteProfileContent />
    </Suspense>
  )
}
