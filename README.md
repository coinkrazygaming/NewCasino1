# Jackpot Casino - Sweepstakes Social Casino

A fully functional sweepstakes social casino platform with dual virtual currencies (GC & SC).

## Features

### User-Facing Platform
- Landing page with game previews
- User registration/login with NextAuth
- Virtual wallet with GC and SC balances
- Gold Coin Store with packages
- Full game selection (Slots, Blackjack, Roulette, Video Poker, Fish)
- Transaction history
- Profile settings

### Admin Panel
- Admin login (coinkrazy26@gmail.com / admin123)
- User management (view, adjust balances, ban)
- Transaction history viewing
- Game management (enable/disable games)
- Platform analytics

### Currencies
- **GC (Gold Coins)**: Purchased in store, no real value, entertainment only
- **SC (Sweepstakes Coins)**: Awarded FREE with purchases (100 SC per $100 spent), can be used to play for prizes

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js with credentials provider

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe account (for payment integration)

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up your environment variables:
```bash
# Edit .env file with your database and API keys
cp .env.example .env
```

3. Set up the database:
```bash
# Push schema to database
npx prisma db push

# Seed the database with admin user and games
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Admin Access
- URL: `/admin`
- Email: `coinkrazy26@gmail.com`
- Password: `admin123`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (dashboard)/       # User dashboard pages
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── users/         # User CRUD
│   │   ├── games/         # Game management
│   │   ├── purchase/      # Store purchases
│   │   ├── wallet/        # Wallet operations
│   │   └── admin/         # Admin API endpoints
│   └── page.tsx           # Landing page
├── lib/                   # Utility libraries
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # NextAuth config
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript types
prisma/
├── schema.prisma          # Database schema
└── seed.ts               # Database seed script
```

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Users
- `POST /api/users` - Register new user
- `GET /api/users` - Get all users (admin)

### Games
- `GET /api/games` - List all active games
- `GET /api/games/[id]` - Get game details
- `POST /api/games/[id]/play` - Place a bet

### Wallet & Transactions
- `GET /api/wallet` - Get user balance
- `POST /api/wallet` - Update balance
- `GET /api/transactions` - Get transaction history
- `GET /api/purchase` - Get store packages
- `POST /api/purchase` - Purchase GC package

### Admin
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users` - User actions (adjust balance, ban)
- `GET /api/admin/games` - List all games
- `PATCH /api/admin/games` - Update game settings
- `GET /api/admin/transactions` - All transactions
- `GET /api/admin/stats` - Platform statistics

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with `vercel deploy`

### Database
Use Vercel Postgres or any PostgreSQL provider:
```bash
# Update DATABASE_URL in .env
DATABASE_URL="postgresql://..."
```

## License

MIT
