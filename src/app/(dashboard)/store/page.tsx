'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart, Gift, Check, Loader2 } from 'lucide-react'

interface Package {
  id: string
  name: string
  gcAmount: number
  price: number
  scBonus: number
  popular?: boolean
}

export default function StorePage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/purchase')
      .then(res => res.json())
      .then(setPackages)
      .catch(console.error)
  }, [])

  const handlePurchase = async (pkgId: string) => {
    setLoading(pkgId)
    try {
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkgId }),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Purchase failed:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">
          <span className="gold-gradient">Gold</span> Store
        </h1>
        <p className="text-gray-400">Purchase GC packages and get FREE SC bonus!</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-2">
          <Check className="w-5 h-5" />
          Purchase successful! Your balance has been updated.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`casino-card p-6 rounded-2xl relative ${
              pkg.popular ? 'border-yellow-500/50' : ''
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-yellow-500 text-gray-900 text-xs font-semibold">
                BEST VALUE
              </div>
            )}

            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🪙</div>
              <h3 className="text-xl font-bold text-yellow-400">{pkg.gcAmount.toLocaleString()} GC</h3>
              <p className="text-gray-400 text-sm">+ {pkg.scBonus} SC FREE!</p>
            </div>

            <div className="text-center mb-4">
              <span className="text-3xl font-bold">${pkg.price}</span>
            </div>

            <button
              onClick={() => handlePurchase(pkg.id)}
              disabled={loading === pkg.id}
              className="w-full gold-button py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading === pkg.id ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Buy Now
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="casino-card p-6 rounded-2xl">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-red-400" />
          How SC Bonus Works
        </h3>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>• Every GC purchase comes with FREE Sweepstakes Coins (SC)</li>
          <li>• 100 SC awarded per $100 spent</li>
          <li>• SC can be used to play for chances to win prizes</li>
          <li>• 100 SC = $100 USD equivalent value</li>
          <li>• SC cannot be purchased directly - only earned as bonus!</li>
        </ul>
      </div>
    </div>
  )
}
