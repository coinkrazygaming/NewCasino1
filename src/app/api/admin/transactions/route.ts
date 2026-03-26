import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { username: true, email: true } } }
    }),
    prisma.transaction.count()
  ])

  return NextResponse.json({ transactions, total, page, limit })
}
