import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, username, password } = body

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        gcBalance: 1000,
        scBalance: 10,
      }
    })

    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'BONUS',
        amount: 1000,
        currency: 'GC',
        status: 'COMPLETED',
        details: 'Welcome bonus',
      }
    })

    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'BONUS',
        amount: 10,
        currency: 'SC',
        status: 'COMPLETED',
        details: 'Welcome SC',
      }
    })

    return NextResponse.json({ 
      user: { id: user.id, email: user.email, username: user.username } 
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}

export async function GET() {
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
