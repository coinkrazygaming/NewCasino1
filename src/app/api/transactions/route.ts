import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as any).id
  const isAdmin = (session.user as any).role === 'ADMIN'

  const transactions = await prisma.transaction.findMany({
    where: isAdmin ? {} : { userId },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { user: { select: { username: true, email: true } } }
  })

  return NextResponse.json(transactions)
}
