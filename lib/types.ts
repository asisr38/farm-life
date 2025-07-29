// Navigation Types
export interface NavigationItem {
  id: string
  label: string
}

export interface PageNavigationItem {
  href: string
  label: string
}

export interface NavigationProps {
  activeSection?: string
  onNavigate?: (sectionId: string) => void
}

// Goal Types
export interface Goal {
  icon: React.ComponentType<any>
  title: string
  target: string
  description: string
  color: string
}

// Phase Types
export interface Phase {
  title: string
  months: string
  budget: string
  keySpend: string
  output: string
  color: string
}

// Zone Types
export interface Zone {
  name: string
  size: string
  functions: string
  color: string
}

// Risk Types
export interface Risk {
  risk: string
  mitigation: string
  severity: 'low' | 'medium' | 'high'
}

// Form Types
export interface CalculatorData {
  landSize: number
  initialInvestment: number
  annualLabor: number
  cropsGrown: number
  livestockCount: number
  touristVisitors: number
}

export interface CalculatorResults {
  revenue: {
    crops: number
    livestock: number
    tourism: number
    total: number
  }
  expenses: {
    labor: number
    inputs: number
    maintenance: number
    total: number
  }
  netIncome: number
  roi: number
}

// Component Props
export interface HeroSectionProps {
  onGetStarted: () => void
}

export interface SectionProps {
  className?: string
  children?: React.ReactNode
}

// Animation Types
export interface AnimationVariants {
  hidden: { opacity: number; y?: number; x?: number }
  visible: { opacity: number; y?: number; x?: number }
}

// Utility Types
export type ButtonVariant = 'primary' | 'secondary' | 'outline'
export type CardVariant = 'default' | 'glass' | 'gradient'
export type TextSize = 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' 