'use client'

import { useEffect, useState } from 'react'
import { Users as UsersIcon, Ban, Ban as BanIcon, Plus, Minus, Search } from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [actionType, setActionType] = useState<'adjust' | 'ban' | 'unban'>('adjust')
  const [adjustAmount, setAdjustAmount] = useState(0)
  const [adjustCurrency, setAdjustCurrency] = useState<'GC' | 'SC'>('GC')
  const [reason, setReason] = useState('')

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleAction = async () => {
    if (!selectedUser) return
    
    const action = actionType === 'adjust' ? 'adjust_balance' : actionType === 'ban' ? 'ban' : 'unban'
    const data = actionType === 'adjust' 
      ? { amount: adjustAmount, currency: adjustCurrency, reason }
      : {}

    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUser.id, action, data }),
    })

    if (res.ok) {
      const updated = await fetch('/api/admin/users').then(r => r.json())
      setUsers(updated)
      setShowModal(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">
          <span className="text-purple-400">User</span> Management
        </h1>
      </div>

      <div className="bg-gray-800/50 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">User</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">GC Balance</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">SC Balance</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-800/30">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-yellow-400">{user.gcBalance?.toLocaleString()}</td>
                <td className="px-4 py-3 text-red-400">{user.scBalance?.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedUser(user); setActionType('adjust'); setShowModal(true); }}
                      className="p-2 rounded-lg hover:bg-gray-700 text-yellow-400"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedUser(user); setActionType('ban'); setShowModal(true); }}
                      className="p-2 rounded-lg hover:bg-gray-700 text-red-400"
                      disabled={user.status === 'BANNED'}
                    >
                      <BanIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Action on {selectedUser?.username}</h3>
            
            {actionType === 'adjust' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Amount</label>
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Currency</label>
                  <select
                    value={adjustCurrency}
                    onChange={(e) => setAdjustCurrency(e.target.value as 'GC' | 'SC')}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
                  >
                    <option value="GC">GC</option>
                    <option value="SC">SC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Reason</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600"
                    placeholder="Reason for adjustment"
                  />
                </div>
              </div>
            )}

            {actionType === 'ban' && (
              <p className="text-gray-400">Are you sure you want to ban this user?</p>
            )}

            {actionType === 'unban' && (
              <p className="text-gray-400">Are you sure you want to unban this user?</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className="px-4 py-2 rounded-lg bg-yellow-500 text-gray-900 font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
