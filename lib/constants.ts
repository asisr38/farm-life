import { Heart, Target, MapPin, Sprout, Users, Calendar, Shield, ArrowRight, CheckCircle, AlertTriangle, Leaf, DollarSign, TrendingUp, Home, Building, Trees } from 'lucide-react'
import { NavigationItem, PageNavigationItem, Goal, Phase, Zone, Risk } from './types'

// Site Configuration
export const SITE_CONFIG = {
  title: 'Kathmandu Valley Farm',
  description: 'Transform your life through sustainable farming in Nepal\'s beautiful Kathmandu Valley',
  url: 'https://farm-life.vercel.app',
  logo: 'Grow Your Future',
} as const

// Navigation Data
export const HOME_NAV_ITEMS: NavigationItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'summary', label: 'Why This Matters' },
  { id: 'context', label: 'Our Story' },
  { id: 'lease-models', label: 'Choose Your Path' },
  { id: 'calculator', label: 'Your Journey' },
  { id: 'action-plan', label: 'Get Started' },
  { id: 'risks', label: 'Grow Stronger' },
  { id: 'contact', label: 'Community' },
]

export const PAGE_NAV_ITEMS: PageNavigationItem[] = [
  { href: '/', label: 'Home' },
  { href: '/my-path', label: 'My Path' },
]

// Goals Data for My Path Page
export const GOALS: Goal[] = [
  {
    icon: Sprout,
    title: 'Food Security',
    target: '≥ 70% of household calories',
    description: 'grown on-site by end of Year 2',
    color: 'text-farm-green-600'
  },
  {
    icon: Target,
    title: 'Net Cash Flow',
    target: 'Farm + agritourism covers OPEX',
    description: '+ 25% buffer by Year 3',
    color: 'text-valley-blue-600'
  },
  {
    icon: Users,
    title: 'Community Impact',
    target: 'Min. 100 farm-day visitors/yr',
    description: 'workshops, WWOOF, school trips',
    color: 'text-earth-brown-600'
  },
  {
    icon: Heart,
    title: 'Lifestyle Balance',
    target: '≤ 20 hr/wk remote coding',
    description: 'keeps US income while farm ramps',
    color: 'text-farm-green-600'
  }
]

// Phases Data for My Path Page
export const PHASES: Phase[] = [
  {
    title: 'Set-up',
    months: '0-6',
    budget: '47 Lakh NPR',
    keySpend: 'lease deposit + cottage + solar + wells/drip',
    output: 'Water, shelter, power secured',
    color: 'bg-farm-green-500'
  },
  {
    title: 'Intensive Veg',
    months: '6-12',
    budget: '18 Lakh NPR',
    keySpend: 'Beds, tunnels, seed, tiller',
    output: '1st CSA harvest; 30 boxes/week',
    color: 'bg-valley-blue-500'
  },
  {
    title: 'Livestock & Tourism',
    months: '12-24',
    budget: '10 Lakh NPR',
    keySpend: 'Goat shed, mobile coop, visitor washroom',
    output: 'Milk, eggs, weekend farm-stay',
    color: 'bg-earth-brown-500'
  },
  {
    title: 'Scale & Diversify',
    months: '24-36',
    budget: '14 Lakh NPR',
    keySpend: 'Cold-room container + 2 guest yurts',
    output: 'Year-round supply; 2-night workshop packages',
    color: 'bg-farm-green-600'
  }
]

// Zones Data for My Path Page
export const ZONES: Zone[] = [
  {
    name: 'Homestead Core',
    size: '0.5 ropani',
    functions: 'Cob/earth-bag cottage; 1 kitchen garden; rain-water tanks',
    color: 'bg-farm-green-100'
  },
  {
    name: 'Veg Intensive',
    size: '3 ropani',
    functions: '60 raised beds (75cm × 15m); two 6 × 30m poly-tunnels; drip & mulch',
    color: 'bg-valley-blue-100'
  },
  {
    name: 'Animal Alley',
    size: '0.5 ropani',
    functions: '6-8 dwarf goats (milk + manure), 50 dual-purpose chickens in mobile coop',
    color: 'bg-earth-brown-100'
  },
  {
    name: 'Agro-forestry Buffer',
    size: '1 ropani',
    functions: 'Nitrogen-fixing fodder trees (Gliricidia, Flemingia), citrus, avocado',
    color: 'bg-farm-green-100'
  }
]

// Risks Data for My Path Page
export const RISKS: Risk[] = [
  {
    risk: 'Capital drain before breakeven',
    mitigation: 'Keep a 20 hr/wk remote dev contract for Yr 1-2; ring-fence farm account',
    severity: 'high'
  },
  {
    risk: 'Lease terminated for sale',
    mitigation: 'Pre-register lease + Right-of-First-Refusal; diversify by networking with two backup landlords',
    severity: 'medium'
  },
  {
    risk: 'Labour shortage',
    mitigation: 'Mechanise (walk-behind tiller), stagger plantings, rely on volunteers in peak months',
    severity: 'medium'
  },
  {
    risk: 'Market price shocks',
    mitigation: 'Lock in subscription CSA; add value-adds (pesto, goat cheese) with higher margins',
    severity: 'low'
  }
]

// Next Steps Data for My Path Page
export const NEXT_STEPS = [
  'List your non-negotiables (within 90-min drive of family, spring water, ≥ 5 ropani flat terrace)',
  'Engage a local agronomist/realtor to scout three candidate plots; schedule November visit',
  'Draft lease template now (English + Nepali) so you negotiate from strength',
  'Line up remote-work retainer with current U.S. employer—it will be your runway',
  'Book PDC with Nepal Permaculture Group for next spring intake; networking gold',
  'Start digital presence (Instagram + landing page) today; share the "journey" to build audience'
]

// Financial Calculator Constants
export const CALCULATOR_DEFAULTS = {
  landSize: 5,
  initialInvestment: 2500000,
  annualLabor: 150000,
  cropsGrown: 15,
  livestockCount: 10,
  touristVisitors: 100
} as const

// Animation Constants
export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8
} as const

export const ANIMATION_DELAYS = {
  stagger: 0.1,
  section: 0.2
} as const

// Color Scheme
export const COLORS = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d'
  },
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8'
  },
  accent: {
    50: '#fdf2f8',
    100: '#fce7f3',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d'
  }
} as const

// Breakpoints for responsive design
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const 