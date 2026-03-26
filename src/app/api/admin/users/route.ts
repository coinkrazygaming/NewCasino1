import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      gcBalance: true,
      scBalance: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(users)
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminId = (session.user as any).id
    const body = await request.json()
    const { userId, action, data } = body

    let user
    switch (action) {
      case 'adjust_balance':
        user = await prisma.user.update({
          where: { id: userId },
          data: data.currency === 'SC'
            ? { scBalance: { increment: data.amount } }
            : { gcBalance: { increment: data.amount } }
        })
        await prisma.transaction.create({
          data: {
            userId,
            type: 'ADJUSTMENT',
            amount: data.amount,
            currency: data.currency,
            status: 'COMPLETED',
            details: data.reason,
          }
        })
        break

      case 'ban':
        user = await prisma.user.update({
          where: { id: userId },
          data: { status: 'BANNED' }
        })
        break

      case 'unban':
        user = await prisma.user.update({
          where: { id: userId },
          data: { status: 'ACTIVE' }
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    await prisma.adminAction.create({
      data: {
        adminId,
        action: `user_${action}`,
        targetType: 'User',
        targetId: userId,
        details: data,
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Admin user action error:', error)
    return NextResponse.json({ error: 'Action failed' }, { status: 500 })
  }
}
