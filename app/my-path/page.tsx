'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { GOALS, PHASES, ZONES, RISKS, NEXT_STEPS, ANIMATION_DURATION, ANIMATION_DELAYS } from '@/lib/constants'
import { getRiskSeverityColor } from '@/lib/utils'

export default function MyPath() {
  const [activePhase, setActivePhase] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-farm pt-16">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="text-gradient-primary">My Path</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              A three-year transition roadmap from U.S. software developer to sustainable homestead 
              in Kathmandu Valley—creating a place that feeds you, pays its own way, and serves as 
              a learning community for visitors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              1. Clarify Your "Why" in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These targets help you decide how much land, labour and capital you actually need—so the plan stays grounded.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GOALS.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: ANIMATION_DURATION.slow, delay: index * ANIMATION_DELAYS.stagger }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <div className={`flex justify-center mb-4 ${goal.color}`}>
                  <goal.icon className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {goal.title}
                </h3>
                <p className="text-sm font-medium text-gray-800 mb-1">
                  {goal.target}
                </p>
                <p className="text-xs text-gray-600">
                  {goal.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal & Ownership */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              2. Legal & Ownership Box-checking
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Do this while still in the U.S. to set yourself up for success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">NRN Citizenship</h3>
              <p className="text-gray-600 mb-4">
                Obtain—or renew—NRN citizenship: lets you live in Nepal indefinitely and buy land, 
                but only up to 2 ropani (≈ 0.105 ha) inside the Valley; more if you go a little outside.
              </p>
              <div className="bg-farm-green-50 p-4 rounded-lg">
                <p className="text-sm text-farm-green-700">
                  💡 Consider Alpine Law Associates for legal guidance
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Entity Structure</h3>
              <div className="space-y-4">
                <div className="p-4 bg-valley-blue-50 rounded-lg">
                  <h4 className="font-medium text-valley-blue-800 mb-2">Private Limited Company</h4>
                  <p className="text-sm text-valley-blue-700">
                    For agritourism + produce sales, lets you lease unlimited land and gives VAT registration
                  </p>
                </div>
                <div className="p-4 bg-earth-brown-50 rounded-lg">
                  <h4 className="font-medium text-earth-brown-800 mb-2">Personal NRN Title</h4>
                  <p className="text-sm text-earth-brown-700">
                    Keep a small "homestead" plot (≤ 2 ropani) for the farmhouse itself
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Find & Secure Plot */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              3. Find & Secure the Right Plot
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Months 0-6: Focus on areas 15-25 km from Ring Road for clean air yet market access.
            </p>
          </motion.div>

          <div className="bg-gradient-to-r from-farm-green-50 to-valley-blue-50 rounded-2xl p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Radius</h4>
                <p className="text-sm text-gray-600">
                  Budhanilkantha, Lele, Dhaksi, Bhangal, Namobuddha
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Lease Cost</h4>
                <p className="text-sm text-gray-600">
                  NPR 1-3 lakh/ropani/yr. Budget 1.5 lakh/ropani on high side
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Water</h4>
                <p className="text-sm text-gray-600">
                  Prioritise gravity-fed springs or canals
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tenure</h4>
                <p className="text-sm text-gray-600">
                  5+5-year lease-with-option-to-buy
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Farm System Design */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              4. Design the Farm System
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Months 4-9: Zoning your first 5 ropani for maximum efficiency and sustainability.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {ZONES.map((zone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl border-2 border-white ${zone.color}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Zone {String.fromCharCode(65 + index)} – {zone.name}
                  </h3>
                  <span className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded">
                    {zone.size}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{zone.functions}</p>
              </motion.div>
            ))}
          </div>

          {/* Energy & Tech */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Energy & Technology</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Solar Power System</h4>
                <p className="text-sm text-gray-600">
                  10 kW rooftop solar + 5 kWh Li-ion: covers house, pump, cold-room and compact EV-three-wheeler
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Farm Management Tech</h4>
                <p className="text-sm text-gray-600">
                  FieldKit or custom React dashboard for volunteers to record inputs & yields—great teaching tool
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Phase-in Timeline */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              5. Phase-in Timeline & Budget
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A structured approach to building your sustainable homestead over 36 months.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {PHASES.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`card cursor-pointer transition-all duration-300 ${
                  activePhase === index ? 'ring-2 ring-farm-green-500 scale-105' : ''
                }`}
                onClick={() => setActivePhase(index)}
              >
                <div className={`w-12 h-12 rounded-xl ${phase.color} text-white flex items-center justify-center mb-4 text-lg font-bold`}>
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{phase.title}</h3>
                <p className="text-sm text-gray-600 mb-2">Months {phase.months}</p>
                <p className="text-lg font-bold text-farm-green-600">{phase.budget}</p>
                <p className="text-xs text-gray-500 mt-2">{phase.output}</p>
              </motion.div>
            ))}
          </div>

          {/* Running Costs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-farm-green-50 to-valley-blue-50 rounded-2xl p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Running Cost (Mature)</h4>
                <p className="text-2xl font-bold text-farm-green-600">9-10 Lakh/yr</p>
                <p className="text-sm text-gray-600">Labour, feed grain, packaging</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Projected Revenue (Yr 3)</h4>
                <p className="text-2xl font-bold text-valley-blue-600">16-18 Lakh</p>
                <p className="text-sm text-gray-600">Veg CSA + farm-stay + classes</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Net Profit</h4>
                <p className="text-2xl font-bold text-earth-brown-600">6 Lakh (35%)</p>
                <p className="text-sm text-gray-600">Sustainable margin</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community & Teaching */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              6. Community & Teaching Components
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Building multiple revenue streams while creating positive impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">WWOOF Host Farm</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Register; 2 volunteers max at a time (food + bed for 5 hrs work)
                </p>
                <p className="text-xs text-farm-green-600 font-medium">
                  Impact: Free labour, global exposure
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Weekend Workshops</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Monthly "Intro to Permaculture" / "Nepali Goat Cheese" (₨ 2,000 fee)
                </p>
                <p className="text-xs text-valley-blue-600 font-medium">
                  Income: 15 pax brings ₨ 30,000 gross; builds mailing list
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">School Eco-camps</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Partner with int'l schools in Lalitpur/Kathmandu for 1-day field trips
                </p>
                <p className="text-xs text-earth-brown-600 font-medium">
                  Income: Flat ₨ 400/student incl. lunch
                </p>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Digital Storytelling</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Use software skills for React/Next site with booking, live soil-sensor dashboard, blog
                </p>
                <p className="text-xs text-farm-green-600 font-medium">
                  Impact: Enhances brand; remote revenue via Patreon/courses
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* De-risking */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              7. De-risking the Leap
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Identifying potential challenges and practical solutions.
            </p>
          </motion.div>

          <div className="space-y-4">
            {RISKS.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${getRiskSeverityColor(item.severity)}`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.risk}</h3>
                    <p className="text-sm text-gray-600">{item.mitigation}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              8. Concrete Next Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Immediately actionable steps to begin your transformation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NEXT_STEPS.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-farm-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700">{step}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-farm-green-600 to-valley-blue-600 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              This roadmap transforms dreams into actionable steps. Your sustainable future 
              in Kathmandu Valley starts with the first decision to move forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-farm-green-600 font-semibold py-3 px-8 rounded-2xl hover:bg-gray-50 transition-colors">
                Start Planning Today
              </button>
              <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-2xl hover:bg-white/10 transition-colors">
                Connect with Community
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 