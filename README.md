# Kathmandu Valley Farm - Organic Farming Website

A modern, interactive website that visually demonstrates the concept of leasing and operating an organic farm in Kathmandu Valley, Nepal. This project showcases the most capital-efficient approach to starting organic farming with minimal upfront investment.

## 🌱 Project Overview

This website transforms the comprehensive farm planning document into an engaging, interactive experience that helps potential farmers understand:

- **Executive Summary**: Key benefits and financial projections
- **Market Context**: Current state of farming in Kathmandu Valley
- **Lease Models**: Interactive comparison of different leasing structures
- **Financial Calculator**: Dynamic tool for projecting outcomes
- **Action Plan**: Step-by-step implementation roadmap
- **Risk Assessment**: Comprehensive risk analysis and mitigation strategies
- **Resources**: Useful contacts and organizations

## ✨ Features

### 🎨 Modern Design
- **Responsive Layout**: Optimized for all devices (desktop, tablet, mobile)
- **Beautiful Animations**: Smooth scroll animations and hover effects using Framer Motion
- **Custom Color Scheme**: Farm-themed colors (farm-green, valley-blue, earth-brown)
- **Typography**: Clean, readable fonts with proper hierarchy

### 📊 Interactive Components
- **Financial Calculator**: Real-time projections based on user inputs
- **Lease Model Comparison**: Interactive cards with detailed breakdowns
- **Risk Assessment Tool**: Visual risk matrix with mitigation strategies
- **Resource Filter**: Categorized contacts and organizations
- **Timeline Navigation**: Smooth scrolling between sections

### 📈 Data Visualization
- **Charts**: Financial projections using Recharts
- **Progress Indicators**: Visual timeline for action plan
- **Risk Matrix**: Color-coded risk assessment
- **Statistics Cards**: Key metrics and numbers

## 🚀 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom design system
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## 📁 Project Structure

```
farm-life/
├── app/
│   ├── globals.css          # Global styles and TailwindCSS
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page component
├── components/
│   ├── Navigation.tsx       # Navigation bar with smooth scrolling
│   ├── HeroSection.tsx      # Landing hero with background image
│   ├── ExecutiveSummary.tsx # Key benefits and financial snapshot
│   ├── ContextSection.tsx   # Market context and opportunities
│   ├── LeaseModels.tsx      # Interactive lease model comparison
│   ├── FinancialCalculator.tsx # Dynamic financial projections
│   ├── ActionPlan.tsx       # Step-by-step implementation timeline
│   ├── RiskAssessment.tsx   # Risk analysis and mitigation
│   └── ContactSection.tsx   # Resources and contact information
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18.17.0 or higher
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd farm-life
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

### Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts and cache

### Code Quality

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Run `npm run lint && npm run format && npm run type-check` before committing.

## 🎯 Key Sections

### 1. Hero Section
- Stunning background image of Kathmandu Valley
- Compelling value proposition
- Key statistics (42% farming households, 0.27 ha average, 20-50% price premium)
- Call-to-action buttons

### 2. Executive Summary
- Four key benefits with icons
- Financial snapshot (Year 1-3 projections)
- Capital-light approach explanation

### 3. Context Section
- Current farming statistics
- Market opportunities
- Visual data representation

### 4. Lease Models
- Five different leasing structures
- Interactive comparison table
- Detailed pros and cons
- Best-fit recommendations

### 5. Financial Calculator
- Interactive input sliders
- Real-time projections
- Visual charts
- ROI calculations

### 6. Action Plan
- Six-step implementation timeline
- Expandable details
- Expected outcomes
- Success metrics

### 7. Risk Assessment
- Four main risk categories
- Impact and likelihood analysis
- Mitigation strategies
- Risk management framework

### 8. Contact & Resources
- Categorized resource filter
- Contact information
- Useful organizations
- Bottom line summary

## 🎨 Design System

### Colors
- **Farm Green**: `#22c55e` - Primary brand color
- **Valley Blue**: `#3b82f6` - Secondary accent
- **Earth Brown**: `#ef4444` - Tertiary accent
- **Neutral Grays**: Various shades for text and backgrounds

### Typography
- **Primary Font**: Inter (sans-serif)
- **Secondary Font**: Merriweather (serif)
- **Responsive Sizing**: Scales appropriately across devices

### Components
- **Cards**: Consistent shadow and border radius
- **Buttons**: Primary and secondary variants
- **Animations**: Smooth transitions and hover effects

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Customization

### Adding New Sections
1. Create a new component in the `components/` directory
2. Import and add it to `app/page.tsx`
3. Update navigation in `components/Navigation.tsx`

### Modifying Colors
Update the color palette in `tailwind.config.js`:
```javascript
colors: {
  'farm-green': { /* color variations */ },
  'valley-blue': { /* color variations */ },
  'earth-brown': { /* color variations */ }
}
```

### Adding Animations
Use Framer Motion for animations:
```javascript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
>
  {/* Content */}
</motion.div>
```

## 📊 Performance Optimization

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic component-based code splitting
- **Lazy Loading**: Images and components load as needed
- **Minification**: Production builds are automatically minified

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Custom domain configuration available

### Other Platforms
- **Netlify**: Compatible with Next.js
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For questions or support:
- Email: info@kathmanduvalleyfarm.com
- Phone: +977-1-4XXXXXX
- Location: Kathmandu Valley, Nepal

---

**Document compiled**: July 28, 2025  
**Last updated**: December 2024