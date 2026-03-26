import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const STORE_PACKAGES = [
  { id: 'gc_500', gcAmount: 500, price: 4.99, scBonus: 5 },
  { id: 'gc_1000', gcAmount: 1000, price: 9.99, scBonus: 10, popular: true },
  { id: 'gc_2500', gcAmount: 2500, price: 19.99, scBonus: 25 },
  { id: 'gc_5000', gcAmount: 5000, price: 39.99, scBonus: 50 },
  { id: 'gc_10000', gcAmount: 10000, price: 79.99, scBonus: 100 },
]

export async function GET() {
  return NextResponse.json(STORE_PACKAGES)
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await request.json()
    const { packageId } = body

    const pkg = STORE_PACKAGES.find(p => p.id === packageId)
    if (!pkg) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        gcBalance: { increment: pkg.gcAmount },
        scBalance: { increment: pkg.scBonus }
      }
    })

    await prisma.transaction.create({
      data: {
        userId,
        type: 'PURCHASE',
        amount: pkg.gcAmount,
        currency: 'GC',
        status: 'COMPLETED',
        details: `Purchased ${pkg.gcAmount} GC + ${pkg.scBonus} SC bonus`,
      }
    })

    if (pkg.scBonus > 0) {
      await prisma.transaction.create({
        data: {
          userId,
          type: 'BONUS',
          amount: pkg.scBonus,
          currency: 'SC',
          status: 'COMPLETED',
          details: `SC bonus with ${pkg.gcAmount} GC purchase`,
        }
      })
    }

    return NextResponse.json({
      success: true,
      gcBalance: user.gcBalance,
      scBalance: user.scBalance
    })
  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json({ error: 'Purchase failed' }, { status: 500 })
  }
}
