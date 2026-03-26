import Link from 'next/link'
import { Puzzle, Gamepad2, Gift, Shield, Zap, DollarSign } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/20 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6">
              <span className="gold-gradient">Jackpot</span> Puzzle
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Experience the thrill of a real casino from home. Play with Gold Coins 
              for fun, or win Sweepstakes Coins that can be redeemed for prizes!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="gold-button px-8 py-4 rounded-full text-lg inline-flex items-center gap-2"
              >
                <Gift className="w-5 h-5" />
                Get Free SC
              </Link>
              <Link 
                href="/games" 
                className="px-8 py-4 rounded-full text-lg border-2 border-yellow-500/30 text-yellow-400 hover:border-yellow-500/60 transition-all inline-flex items-center gap-2"
              >
                <Gamepad2 className="w-5 h-5" />
                Play Now
              </Link>
            </div>
          </div>

          {/* Currency Info */}
          <div className="grid md:grid-cols-2 gap-6 mt-16">
            <div className="casino-card p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-2xl">🪙</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-yellow-400">Gold Coins (GC)</h3>
                  <p className="text-sm text-gray-400">Entertainment Only</p>
                </div>
              </div>
              <p className="text-gray-400">
                Purchase GC packages from our store. Use them to play all our exciting games. 
                GC has no real-world value and cannot be redeemed.
              </p>
            </div>
            <div className="casino-card p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-2xl">★</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-400">Sweepstakes Coins (SC)</h3>
                  <p className="text-sm text-gray-400">Free Bonus with Purchases</p>
                </div>
              </div>
              <p className="text-gray-400">
                SC is awarded FREE with every purchase (100 SC per $100 spent). 
                Play with SC for a chance to win prizes! 100 SC = $100 USD value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-heading">
            Why Play <span className="gold-gradient">Jackpot Puzzle</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="casino-card p-6 rounded-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                <Puzzle className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">50+ Games</h3>
              <p className="text-gray-400">Slots, Blackjack, Roulette, Video Poker & more!</p>
            </div>
            <div className="casino-card p-6 rounded-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure & Legal</h3>
              <p className="text-gray-400">Sweepstakes model complies with US regulations</p>
            </div>
            <div className="casino-card p-6 rounded-2xl text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Play</h3>
              <p className="text-gray-400">No downloads needed, play instantly in your browser</p>
            </div>
          </div>
        </div>
      </section>

      {/* Games Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-heading">
            Popular <span className="gold-gradient">Games</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Lucky Slots', icon: '🎰', color: 'from-purple-500/20 to-pink-500/20' },
              { name: 'Blackjack', icon: '♠️', color: 'from-blue-500/20 to-indigo-500/20' },
              { name: 'Roulette', icon: '🎡', color: 'from-red-500/20 to-orange-500/20' },
              { name: 'Video Poker', icon: '🃏', color: 'from-green-500/20 to-teal-500/20' },
            ].map((game) => (
              <Link 
                key={game.name}
                href="/games" 
                className={`casino-card p-6 rounded-2xl text-center hover:scale-105 transition-transform`}
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl`}>
                  {game.icon}
                </div>
                <h3 className="font-semibold">{game.name}</h3>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              href="/games" 
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              View All Games <Zap className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">
            Ready to <span className="gold-gradient">Win Big?</span>
          </h2>
          <p className="text-gray-400 mb-8">
            Create your free account today and get 1,000 GC + 10 SC to start playing!
          </p>
          <Link 
            href="/register" 
            className="gold-button px-10 py-4 rounded-full text-xl inline-flex items-center gap-2"
          >
            <DollarSign className="w-6 h-6" />
            Sign Up Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p>© 2026 Jackpot Puzzle. All rights reserved.</p>
          <p className="mt-2 text-sm">
            This is a sweepstakes social casino. GC has no real value. 
            SC is awarded as a bonus and cannot be purchased directly.
          </p>
        </div>
      </footer>
    </div>
  )
}
