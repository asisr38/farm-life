import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CalculatorData, CalculatorResults } from './types'

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency in NPR
 */
export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₨ ${(amount / 100000).toFixed(1)}L`
  }
  if (amount >= 1000) {
    return `₨ ${(amount / 1000).toFixed(1)}K`
  }
  return `₨ ${amount.toLocaleString()}`
}

/**
 * Formats a number as percentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

/**
 * Calculates financial projections for the farm calculator
 */
export function calculateFarmFinancials(data: CalculatorData): CalculatorResults {
  // Revenue calculations (NPR per year)
  const cropRevenue = data.landSize * data.cropsGrown * 15000 // 15k per crop per ropani
  const livestockRevenue = data.livestockCount * 25000 // 25k per animal per year
  const tourismRevenue = data.touristVisitors * 3000 // 3k per visitor per year
  
  const totalRevenue = cropRevenue + livestockRevenue + tourismRevenue
  
  // Expense calculations (NPR per year)
  const laborExpenses = data.annualLabor
  const inputExpenses = data.landSize * 30000 // 30k per ropani for inputs
  const maintenanceExpenses = data.initialInvestment * 0.05 // 5% of initial investment
  
  const totalExpenses = laborExpenses + inputExpenses + maintenanceExpenses
  
  // Net calculations
  const netIncome = totalRevenue - totalExpenses
  const roi = data.initialInvestment > 0 ? (netIncome / data.initialInvestment) * 100 : 0
  
  return {
    revenue: {
      crops: cropRevenue,
      livestock: livestockRevenue,
      tourism: tourismRevenue,
      total: totalRevenue
    },
    expenses: {
      labor: laborExpenses,
      inputs: inputExpenses,
      maintenance: maintenanceExpenses,
      total: totalExpenses
    },
    netIncome,
    roi
  }
}

/**
 * Validates calculator input data
 */
export function validateCalculatorData(data: CalculatorData): string[] {
  const errors: string[] = []
  
  if (data.landSize <= 0) {
    errors.push('Land size must be greater than 0')
  }
  
  if (data.initialInvestment < 0) {
    errors.push('Initial investment cannot be negative')
  }
  
  if (data.annualLabor < 0) {
    errors.push('Annual labor cost cannot be negative')
  }
  
  if (data.cropsGrown < 0) {
    errors.push('Number of crops cannot be negative')
  }
  
  if (data.livestockCount < 0) {
    errors.push('Livestock count cannot be negative')
  }
  
  if (data.touristVisitors < 0) {
    errors.push('Tourist visitors cannot be negative')
  }
  
  return errors
}

/**
 * Smoothly scrolls to an element by ID
 */
export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Gets the severity color for risk assessment
 */
export function getRiskSeverityColor(severity: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-red-600 bg-red-100'
  }
  
  return colors[severity]
}

/**
 * Formats a large number to a more readable format
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Checks if a string is a valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generates a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
} 