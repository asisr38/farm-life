'use client'

import { useState } from 'react'
import HeroSection from '@/components/HeroSection'
import ExecutiveSummary from '@/components/ExecutiveSummary'
import ContextSection from '@/components/ContextSection'
import LeaseModels from '@/components/LeaseModels'
import FinancialCalculator from '@/components/FinancialCalculator'
import ActionPlan from '@/components/ActionPlan'
import RiskAssessment from '@/components/RiskAssessment'
import ContactSection from '@/components/ContactSection'
import Navigation from '@/components/Navigation'

export default function Home() {
  const [activeSection, setActiveSection] = useState('home')

  const handleScroll = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main className="min-h-screen bg-gradient-farm">
      <Navigation activeSection={activeSection} onNavigate={handleScroll} />
      
      <div id="home">
        <HeroSection onGetStarted={() => handleScroll('summary')} />
      </div>
      
      <div id="summary">
        <ExecutiveSummary />
      </div>
      
      <div id="context">
        <ContextSection />
      </div>
      
      <div id="lease-models">
        <LeaseModels />
      </div>
      
      <div id="calculator">
        <FinancialCalculator />
      </div>
      
      <div id="action-plan">
        <ActionPlan />
      </div>
      
      <div id="risks">
        <RiskAssessment />
      </div>
      
      <div id="contact">
        <ContactSection />
      </div>
    </main>
  )
} 