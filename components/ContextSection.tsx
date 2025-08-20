'use client'

import { motion } from 'framer-motion'
import { Heart, Users, MapPin, Sprout } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { t } from '@/lib/intl'

const ContextSection = () => {
  const pathname = usePathname()
  const locale = pathname.startsWith('/ne') ? 'ne' : 'en'

  const currentState = [
    {
      icon: Users,
      title: t('context_current1_title', locale as any),
      value: '11%',
      description: t('context_current1_desc', locale as any),
      story: t('context_current1_story', locale as any),
      color: 'text-farm-green-600'
    },
    {
      icon: MapPin,
      title: t('context_current2_title', locale as any),
      value: '20-25%',
      description: t('context_current2_desc', locale as any),
      story: t('context_current2_story', locale as any),
      color: 'text-earth-brown-600'
    },
    {
      icon: Heart,
      title: t('context_current3_title', locale as any),
      value: '42%',
      description: t('context_current3_desc', locale as any),
      story: t('context_current3_story', locale as any),
      color: 'text-valley-blue-600'
    },
    {
      icon: Sprout,
      title: t('context_current4_title', locale as any),
      value: '0.27 ha',
      description: t('context_current4_desc', locale as any),
      story: t('context_current4_story', locale as any),
      color: 'text-farm-green-600'
    }
  ]

  const opportunities = [
    {
      title: t('context_opp1_title', locale as any),
      description: t('context_opp1_desc', locale as any),
      icon: '🌱'
    },
    {
      title: t('context_opp2_title', locale as any),
      description: t('context_opp2_desc', locale as any),
      icon: '🏔️'
    },
    {
      title: t('context_opp3_title', locale as any),
      description: t('context_opp3_desc', locale as any),
      icon: '🤝'
    },
    {
      title: t('context_opp4_title', locale as any),
      description: t('context_opp4_desc', locale as any),
      icon: '📚'
    }
  ]

  return (
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
            {t('context_title', locale as any)}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('context_subtitle', locale as any)}
          </p>
        </motion.div>

        {/* Current State */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {currentState.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className={`flex justify-center mb-4 ${item.color}`}>
                <item.icon className="h-12 w-12" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {item.value}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {item.description}
              </p>
              <p className="text-sm text-gray-500 italic">
                {item.story}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t('context_time_now_title', locale as any)}
          </h3>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('context_time_now_desc', locale as any)}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {opportunities.map((opportunity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="text-3xl">{opportunity.icon}</div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {opportunity.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {opportunity.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-farm-green-600 to-valley-blue-600 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              {t('context_cta_title', locale as any)}
            </h3>
            <p className="text-xl mb-8 text-green-100">
              {t('context_cta_desc', locale as any)}
            </p>
            <button className="bg-white text-farm-green-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              {t('context_cta_button', locale as any)}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ContextSection 