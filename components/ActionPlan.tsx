'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Heart, Sprout, FileText, Home, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { t } from '@/lib/intl'

const ActionPlan = () => {
  const pathname = usePathname()
  const locale = pathname.startsWith('/ne') ? 'ne' : 'en'

  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      id: 1,
      title: t('action_step1_title', locale as any),
      description: t('action_step1_desc', locale as any),
      icon: Heart,
      details: [
        'Visit areas, feel the energy',
        'Find land within 15-20 km of markets',
        'Check soil quality',
        'Verify clear ownership & access'
      ],
      timeline: 'Week 1-2',
      color: 'bg-farm-green-500'
    },
    {
      id: 2,
      title: t('action_step2_title', locale as any),
      description: t('action_step2_desc', locale as any),
      icon: Sprout,
      details: [
        'Test soil nutrients',
        'Check water availability',
        'Assess drainage',
        'Research suitable crops'
      ],
      timeline: 'Week 3-4',
      color: 'bg-valley-blue-500'
    },
    {
      id: 3,
      title: t('action_step3_title', locale as any),
      description: t('action_step3_desc', locale as any),
      icon: FileText,
      details: [
        'Document agreement with landowner',
        'Include 5-year renewal option',
        'Define harvest sharing or rent',
        'Add future purchase option'
      ],
      timeline: 'Week 5-6',
      color: 'bg-earth-brown-500'
    },
    {
      id: 4,
      title: t('action_step4_title', locale as any),
      description: t('action_step4_desc', locale as any),
      icon: FileText,
      details: [
        'Take your agreement to the Ward Office',
        'Pay the small registration fee',
        'Get your official certificate',
        'Update the land records'
      ],
      timeline: 'Week 7',
      color: 'bg-farm-green-500'
    },
    {
      id: 5,
      title: t('action_step5_title', locale as any),
      description: t('action_step5_desc', locale as any),
      icon: Home,
      details: [
        'Begin with drip irrigation and simple tunnels',
        'Add storage and processing as you find your customers',
        'Build places for visitors when you\'re ready',
        'Grow based on what you learn and what feels right'
      ],
      timeline: 'Month 2-6',
      color: 'bg-valley-blue-500'
    },
    {
      id: 6,
      title: t('action_step6_title', locale as any),
      description: t('action_step6_desc', locale as any),
      icon: Users,
      details: [
        'Talk to restaurants about buying your vegetables',
        'Join a CSA (Community Supported Agriculture) group',
        'Connect with organic markets in the city',
        'Build relationships with people who care about good food'
      ],
      timeline: 'Month 1-3',
      color: 'bg-earth-brown-500'
    }
  ]

  return (
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
            {t('action_title', locale as any)}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t('action_subtitle', locale as any)}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 hidden lg:block"></div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex flex-col lg:flex-row items-start gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Step Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                  <div 
                    className={`card cursor-pointer transition-all duration-300 hover:scale-105 ${
                      activeStep === index ? 'ring-2 ring-farm-green-500 bg-farm-green-50' : ''
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${step.color} text-white flex-shrink-0`}>
                        <step.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {step.title}
                          </h3>
                          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {step.timeline}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {step.description}
                        </p>
                        
                        {/* Expanded Details */}
                        {activeStep === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200 pt-4"
                          >
                            <h4 className="font-semibold text-gray-900 mb-3">What This Means:</h4>
                            <ul className="space-y-2">
                              {step.details.map((detail, detailIndex) => (
                                <li key={detailIndex} className="flex items-start">
                                  <div className="w-2 h-2 bg-farm-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                  <span className="text-gray-700">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="hidden lg:block">
                  <div className={`w-4 h-4 rounded-full border-4 border-white shadow-lg ${
                    activeStep === index ? 'bg-farm-green-500' : 'bg-gray-300'
                  }`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Your Transformation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-farm-green-50 to-valley-blue-50 rounded-2xl p-8 lg:p-12"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Your Transformation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-farm-green-600 mb-2">6 Months</div>
              <div className="text-lg text-gray-600">To Your First Harvest</div>
              <div className="text-sm text-gray-500 mt-2">The moment you taste food you grew yourself</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-valley-blue-600 mb-2">12 Months</div>
              <div className="text-lg text-gray-600">To Financial Independence</div>
              <div className="text-sm text-gray-500 mt-2">When your farm sustains your life</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-earth-brown-600 mb-2">24 Months</div>
              <div className="text-lg text-gray-600">To Living Your Dream</div>
              <div className="text-sm text-gray-500 mt-2">A life that nourishes your soul</div>
            </div>
          </div>
        </motion.div>

        {/* Heartfelt Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gray-900 text-white rounded-2xl p-8 lg:p-12">
            <h3 className="text-3xl font-bold mb-4">
              Remember: Every Expert Was Once a Beginner
            </h3>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Don't let fear of not knowing enough stop you. The land will teach you what you need to know. 
              Every mistake is a lesson, every challenge makes you stronger, and every harvest brings you 
              closer to the life you're meant to live.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
              <div>
                <Heart className="h-8 w-8 text-farm-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Trust Your Intuition</p>
              </div>
              <div>
                <Sprout className="h-8 w-8 text-valley-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Learn as You Grow</p>
              </div>
              <div>
                <Users className="h-8 w-8 text-earth-brown-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Ask for Help</p>
              </div>
            </div>
            <button
              onClick={() => {
                const element = document.getElementById('contact')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="bg-gradient-to-r from-farm-green-600 to-valley-blue-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-farm-green-700 hover:to-valley-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Connect with Our Community
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ActionPlan 