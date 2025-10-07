import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id

    const [total, pending, delivered] = await Promise.all([
      prisma.order.count({
        where: { userId },
      }),
      prisma.order.count({
        where: { userId, status: 'PENDING' },
      }),
      prisma.order.count({
        where: { userId, status: 'DELIVERED' },
      }),
    ])

    return NextResponse.json({
      stats: {
        total,
        pending,
        delivered,
      },
    })
  } catch (error) {
    console.error('Error fetching order stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}