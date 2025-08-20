'use client'

import { motion } from 'framer-motion'
import { Heart, Sprout, Users, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { t } from '@/lib/intl'

const ExecutiveSummary = () => {
  const pathname = usePathname()
  const locale = pathname.startsWith('/ne') ? 'ne' : 'en'

  const reasons = [
    {
      icon: Heart,
      title: t('exec_reason1_title', locale as any),
      description: t('exec_reason1_desc', locale as any),
      color: 'text-farm-green-600'
    },
    {
      icon: Sprout,
      title: t('exec_reason2_title', locale as any),
      description: t('exec_reason2_desc', locale as any),
      color: 'text-valley-blue-600'
    },
    {
      icon: Users,
      title: t('exec_reason3_title', locale as any),
      description: t('exec_reason3_desc', locale as any),
      color: 'text-earth-brown-600'
    },
    {
      icon: Home,
      title: t('exec_reason4_title', locale as any),
      description: t('exec_reason4_desc', locale as any),
      color: 'text-farm-green-600'
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
            {t('exec_title', locale as any)}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('exec_subtitle', locale as any)}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className={`flex justify-center mb-4 ${reason.color}`}>
                <reason.icon className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {reason.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Your Journey */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-farm-green-50 to-valley-blue-50 rounded-2xl p-8 lg:p-12"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t('exec_journey_title', locale as any)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-farm-green-600 mb-2">{t('exec_year1_label', locale as any)}</div>
              <div className="text-lg text-gray-600">{t('exec_year1_desc', locale as any)}</div>
              <div className="text-2xl font-semibold text-gray-900 mt-2">-3 Lakh NPR</div>
              <div className="text-sm text-gray-500">{t('exec_year1_note', locale as any)}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-valley-blue-600 mb-2">{t('exec_year2_label', locale as any)}</div>
              <div className="text-lg text-gray-600">{t('exec_year2_desc', locale as any)}</div>
              <div className="text-2xl font-semibold text-gray-900 mt-2">+4.5 Lakh NPR</div>
              <div className="text-sm text-gray-500">{t('exec_year2_note', locale as any)}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-earth-brown-600 mb-2">{t('exec_year3_label', locale as any)}</div>
              <div className="text-lg text-gray-600">{t('exec_year3_desc', locale as any)}</div>
              <div className="text-2xl font-semibold text-gray-900 mt-2">+6 Lakh NPR</div>
              <div className="text-sm text-gray-500">{t('exec_year3_note', locale as any)}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ExecutiveSummary 