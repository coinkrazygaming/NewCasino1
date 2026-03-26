import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatBalance(amount: number): string {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export function formatCurrency(amount: number, currency: 'GC' | 'SC'): string {
  return `${currency === 'SC' ? '★' : '🪙'} ${formatBalance(amount)}`
}

export function generateBetId(): string {
  return `BET-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function calculatePayout(betAmount: number, multiplier: number): number {
  return betAmount * multiplier
}
