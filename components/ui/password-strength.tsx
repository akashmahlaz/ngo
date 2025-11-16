import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"
import { useMemo } from "react"

interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "", width: 0 }

    let score = 0
    const checks = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }

    // Calculate score
    if (checks.length) score += 25
    if (checks.uppercase) score += 15
    if (checks.lowercase) score += 15
    if (checks.number) score += 20
    if (checks.special) score += 25

    // Determine label and color
    let label = ""
    let color = ""
    if (score < 40) {
      label = "Weak"
      color = "bg-red-500"
    } else if (score < 60) {
      label = "Fair"
      color = "bg-orange-500"
    } else if (score < 80) {
      label = "Good"
      color = "bg-yellow-500"
    } else {
      label = "Strong"
      color = "bg-green-500"
    }

    return { score, label, color, width: score, checks }
  }, [password])

  if (!password) return null

  return (
    <div className={cn("space-y-2", className)}>
      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300", strength.color)}
            style={{ width: `${strength.width}%` }}
          />
        </div>
        <span className={cn("text-sm font-medium", {
          "text-red-600": strength.score < 40,
          "text-orange-600": strength.score >= 40 && strength.score < 60,
          "text-yellow-600": strength.score >= 60 && strength.score < 80,
          "text-green-600": strength.score >= 80,
        })}>
          {strength.label}
        </span>
      </div>

      {/* Requirements Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
        <div className={cn("flex items-center gap-1", strength.checks.length ? "text-green-600" : "text-muted-foreground")}>
          {strength.checks.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          <span>At least 12 characters</span>
        </div>
        <div className={cn("flex items-center gap-1", strength.checks.uppercase ? "text-green-600" : "text-muted-foreground")}>
          {strength.checks.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          <span>One uppercase letter</span>
        </div>
        <div className={cn("flex items-center gap-1", strength.checks.lowercase ? "text-green-600" : "text-muted-foreground")}>
          {strength.checks.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          <span>One lowercase letter</span>
        </div>
        <div className={cn("flex items-center gap-1", strength.checks.number ? "text-green-600" : "text-muted-foreground")}>
          {strength.checks.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          <span>One number</span>
        </div>
        <div className={cn("flex items-center gap-1 sm:col-span-2", strength.checks.special ? "text-green-600" : "text-muted-foreground")}>
          {strength.checks.special ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          <span>One special character (!@#$%^&*)</span>
        </div>
      </div>
    </div>
  )
}
