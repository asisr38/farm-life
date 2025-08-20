'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Check, X, Heart, Users, Home, Sprout, Leaf } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { t } from '@/lib/intl'

const LeaseModels = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const pathname = usePathname()
  const locale = pathname.startsWith('/ne') ? 'ne' : 'en'

  const paths = [
    {
      id: 'simple-lease',
      name: t('lease_simple_name', locale as any),
      icon: Heart,
      description: t('lease_simple_desc', locale as any),
      bestFor: t('lease_simple_best', locale as any),
      keyConsideration: t('lease_simple_consider', locale as any),
      pros: [t('lease_simple_pro1', locale as any), t('lease_simple_pro2', locale as any), t('lease_simple_pro3', locale as any)],
      cons: [t('lease_simple_con1', locale as any), t('lease_simple_con2', locale as any), t('lease_simple_con3', locale as any)],
      color: 'border-farm-green-500'
    },
    {
      id: 'shared-harvest',
      name: t('lease_shared_name', locale as any),
      icon: Users,
      description: t('lease_shared_desc', locale as any),
      bestFor: t('lease_shared_best', locale as any),
      keyConsideration: t('lease_shared_consider', locale as any),
      pros: [t('lease_shared_pro1', locale as any), t('lease_shared_pro2', locale as any), t('lease_shared_pro3', locale as any)],
      cons: [t('lease_shared_con1', locale as any), t('lease_shared_con2', locale as any), t('lease_shared_con3', locale as any)],
      color: 'border-valley-blue-500'
    },
    {
      id: 'lease-to-own',
      name: t('lease_own_name', locale as any),
      icon: Home,
      description: t('lease_own_desc', locale as any),
      bestFor: t('lease_own_best', locale as any),
      keyConsideration: t('lease_own_consider', locale as any),
      pros: [t('lease_own_pro1', locale as any), t('lease_own_pro2', locale as any), t('lease_own_pro3', locale as any)],
      cons: [t('lease_own_con1', locale as any), t('lease_own_con2', locale as any), t('lease_own_con3', locale as any)],
      color: 'border-earth-brown-500'
    },
    {
      id: 'community-farm',
      name: t('lease_comm_name', locale as any),
      icon: Sprout,
      description: t('lease_comm_desc', locale as any),
      bestFor: t('lease_comm_best', locale as any),
      keyConsideration: t('lease_comm_consider', locale as any),
      pros: [t('lease_comm_pro1', locale as any), t('lease_comm_pro2', locale as any), t('lease_comm_pro3', locale as any)],
      cons: [t('lease_comm_con1', locale as any), t('lease_comm_con2', locale as any), t('lease_comm_con3', locale as any)],
      color: 'border-farm-green-500'
    },
    {
      id: 'learning-farm',
      name: t('lease_learn_name', locale as any),
      icon: Leaf,
      description: t('lease_learn_desc', locale as any),
      bestFor: t('lease_learn_best', locale as any),
      keyConsideration: t('lease_learn_consider', locale as any),
      pros: [t('lease_learn_pro1', locale as any), t('lease_learn_pro2', locale as any), t('lease_learn_pro3', locale as any)],
      cons: [t('lease_learn_con1', locale as any), t('lease_learn_con2', locale as any), t('lease_learn_con3', locale as any)],
      color: 'border-valley-blue-500'
    }
  ]

  const selectedPathData = paths.find(path => path.id === selectedModel)

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
          <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('lease_title', locale as any)}</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">{t('lease_subtitle', locale as any)}</p>
        </motion.div>

        {/* Path Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {paths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`card cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedModel === path.id ? 'ring-2 ring-farm-green-500 bg-farm-green-50' : ''
              }`}
              onClick={() => setSelectedModel(path.id)}
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg bg-gray-100 mr-4`}>
                  <path.icon className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{path.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{path.description}</p>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-500">{t('lease_best_for_label', locale as any)}</span>
                  <p className="text-sm text-gray-700">{path.bestFor}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">{t('lease_consider_label', locale as any)}</span>
                  <p className="text-sm text-gray-700">{path.keyConsideration}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Path View */}
        {selectedPathData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-farm-green-50 to-valley-blue-50 rounded-2xl p-8 lg:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedPathData.name}</h3>
                <p className="text-gray-600 mb-6">{selectedPathData.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('lease_best_for_label', locale as any)}</h4>
                    <p className="text-gray-600">{selectedPathData.bestFor}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('lease_consider_label', locale as any)}</h4>
                    <p className="text-gray-600">{selectedPathData.keyConsideration}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center"><Check className="h-5 w-5 text-farm-green-600 mr-2" />{t('lease_love', locale as any)}</h4>
                  <ul className="space-y-2">
                    {selectedPathData.pros.map((pro, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-farm-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center"><X className="h-5 w-5 text-red-600 mr-2" />{t('lease_challenges', locale as any)}</h4>
                  <ul className="space-y-2">
                    {selectedPathData.cons.map((con, index) => (
                      <li key={index} className="flex items-start">
                        <X className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Path Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Finding Your Perfect Path
          </h3>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
              Remember, there's no rush to decide. Many people start with one approach and 
              evolve as they learn and grow. The most important thing is to start somewhere 
              and let your heart guide you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-farm-green-50 rounded-lg">
                <Heart className="h-8 w-8 text-farm-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Follow Your Heart</h4>
                <p className="text-sm text-gray-600">Choose the path that feels right for you, not what others expect</p>
              </div>
              <div className="text-center p-6 bg-valley-blue-50 rounded-lg">
                <Sprout className="h-8 w-8 text-valley-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Start Small</h4>
                <p className="text-sm text-gray-600">You can always expand once you find your rhythm</p>
              </div>
              <div className="text-center p-6 bg-earth-brown-50 rounded-lg">
                <Users className="h-8 w-8 text-earth-brown-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Build Community</h4>
                <p className="text-sm text-gray-600">Connect with others on similar journeys</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default LeaseModels 