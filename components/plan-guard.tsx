"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Crown, Lock } from "lucide-react"
import Link from "next/link"

interface PlanGuardProps {
  children: React.ReactNode
  requiredPlans: string[]
  feature: string
  showUpgradeButton?: boolean
}

export function PlanGuard({ children, requiredPlans, feature, showUpgradeButton = true }: PlanGuardProps) {
  const { data: session } = useSession()
  
  const userSession = session as {
    role?: string
    plan?: string
    planExpiresAt?: string
  }
  
  const userPlan = userSession?.plan
  const userRole = userSession?.role
  const planExpiresAt = userSession?.planExpiresAt ? new Date(userSession.planExpiresAt) : null
  const isPlanExpired = planExpiresAt && new Date() > planExpiresAt
  
  // Check if user has required plan
  const hasAccess = userPlan && requiredPlans.includes(userPlan) && !isPlanExpired
  
  if (hasAccess) {
    return <>{children}</>
  }
  
  // Show upgrade prompt
  const suggestedPlan = userRole === "volunteer" ? "volunteer_plus" : "ngo_plus"
  
  return (
    <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-900/50">
      <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="ml-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
              {isPlanExpired ? "Your plan has expired" : "Upgrade Required"}
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {feature} is available for {requiredPlans.map(p => p.replace("_", " ")).join(" and ")} users.
              {isPlanExpired && " Your subscription has expired. Renew to continue accessing premium features."}
            </p>
          </div>
          {showUpgradeButton && (
            <Button asChild className="flex-shrink-0">
              <Link href={`/upgrade?plan=${suggestedPlan}&reason=${feature.toLowerCase().replace(/\s+/g, "_")}`}>
                <Crown className="h-4 w-4 mr-2" />
                {isPlanExpired ? "Renew Now" : "Upgrade"}
              </Link>
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}

interface PlanBadgeProps {
  showUpgradePrompt?: boolean
}

export function PlanBadge({ showUpgradePrompt = false }: PlanBadgeProps) {
  const { data: session } = useSession()
  
  const userSession = session as {
    role?: string
    plan?: string
    planExpiresAt?: string
  }
  
  const userPlan = userSession?.plan
  const planExpiresAt = userSession?.planExpiresAt ? new Date(userSession.planExpiresAt) : null
  const isPlanExpired = planExpiresAt && new Date() > planExpiresAt
  const isPlusUser = userPlan?.includes("plus")
  
  if (!userPlan) return null
  
  return (
    <div className="flex items-center gap-2">
      {isPlusUser && !isPlanExpired && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-linear-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium">
          <Crown className="h-3 w-3" />
          Plus
        </div>
      )}
      {(!isPlusUser || isPlanExpired) && showUpgradePrompt && (
        <Link href={`/upgrade?plan=${userSession.role}_plus`}>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted hover:bg-accent text-xs font-medium cursor-pointer">
            <AlertCircle className="h-3 w-3" />
            {isPlanExpired ? "Expired" : "Free"}
          </div>
        </Link>
      )}
    </div>
  )
}
