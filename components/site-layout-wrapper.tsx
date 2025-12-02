"use client"

import { usePathname } from "next/navigation"
import { UniversalNavbar } from "@/components/universal-navbar"
import { UniversalFooter } from "@/components/universal-footer"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

export function SiteLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Routes that should NOT show universal navbar/footer
  const isAdminRoute = pathname?.startsWith("/admin")
  const isDashboardRoute = (
    (pathname === "/ngo" || pathname?.startsWith("/ngo/")) &&
    !pathname?.startsWith("/ngos")
  ) || (
    (pathname === "/volunteer" || pathname?.startsWith("/volunteer/")) &&
    !pathname?.startsWith("/volunteers")
  )
  
  const hideNavAndFooter = isAdminRoute || isDashboardRoute
  
  return (
    <>
      {/* Universal navbar shows on public pages only */}
      {!hideNavAndFooter && <UniversalNavbar />}
      <main className={hideNavAndFooter ? "" : ""}>{children}</main>
      {/* Universal footer shows on public pages only */}
      {!hideNavAndFooter && <UniversalFooter />}
      {/* Mobile bottom navigation */}
      {!hideNavAndFooter && <MobileBottomNav />}
    </>
  )
}