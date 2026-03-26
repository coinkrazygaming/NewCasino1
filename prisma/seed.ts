import { PrismaClient, GameType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'coinkrazy26@gmail.com' },
    update: {},
    create: {
      email: 'coinkrazy26@gmail.com',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      gcBalance: 1000000,
      scBalance: 10000,
      status: 'ACTIVE',
    },
  })
  console.log('Admin created:', admin.email)

  // Create Default Games
  const games = [
    { name: 'Lucky Slots', type: 'SLOTS' as GameType, description: 'Classic slot machine with big wins!', rtp: 0.95, minBet: 1, maxBet: 1000 },
    { name: 'Mega Jackpot', type: 'SLOTS' as GameType, description: 'Hit the massive progressive jackpot!', rtp: 0.92, minBet: 10, maxBet: 5000 },
    { name: 'Classic Blackjack', type: 'BLACKJACK' as GameType, description: 'Beat the dealer for big wins!', rtp: 0.98, minBet: 5, maxBet: 1000 },
    { name: 'European Roulette', type: 'ROULETTE' as GameType, description: 'Spin the wheel and test your luck!', rtp: 0.97, minBet: 1, maxBet: 500 },
    { name: 'Jacks or Better', type: 'VIDEO_POKER' as GameType, description: 'Video poker classic - jacks pay!', rtp: 0.96, minBet: 1, maxBet: 100 },
    { name: 'Ocean Riches', type: 'FISH' as GameType, description: 'Catch fish and win coins!', rtp: 0.94, minBet: 10, maxBet: 500 },
  ]

  for (const game of games) {
    await prisma.game.upsert({
      where: { name: game.name },
      update: {},
      create: game,
    })
  }
  console.log('Games seeded')

  // Create welcome transactions for admin
  await prisma.transaction.createMany({
    data: [
      { userId: admin.id, type: 'BONUS', amount: 1000000, currency: 'GC', status: 'COMPLETED', details: 'Initial GC' },
      { userId: admin.id, type: 'BONUS', amount: 10000, currency: 'SC', status: 'COMPLETED', details: 'Initial SC' },
    ],
  })

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
