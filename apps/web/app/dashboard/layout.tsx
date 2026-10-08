import AppLayout from "@/components/dashboard/app-layout"
import { AuthGuard } from "@/components/dashboard/auth-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  )
}
