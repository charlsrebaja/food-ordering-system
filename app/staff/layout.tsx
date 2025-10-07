import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { StaffSidebar } from './components/staff-sidebar'

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/staff/dashboard')
  }

  if (session.user.role !== 'STAFF' && session.user.role !== 'ADMIN') {
    redirect('/unauthorized')
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      <StaffSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}