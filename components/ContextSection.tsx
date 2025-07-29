'use client'

import { motion } from 'framer-motion'
import { Heart, Users, MapPin, Sprout } from 'lucide-react'

const ContextSection = () => {
  const currentState = [
    {
      icon: Users,
      title: 'Young People Leaving',
      value: '11%',
      description: 'Farmers under 35 years of age',
      story: 'Most youth are leaving for cities, but the land is calling them back',
      color: 'text-farm-green-600'
    },
    {
      icon: MapPin,
      title: 'Land Being Lost',
      value: '20-25%',
      description: 'Cropland lost to development over 20 years',
      story: 'Precious farmland is disappearing, but we can save what remains',
      color: 'text-earth-brown-600'
    },
    {
      icon: Heart,
      title: 'Families Still Connected',
      value: '42%',
      description: 'Households still farming in peri-urban areas',
      story: 'These families hold the wisdom and traditions we need to preserve',
      color: 'text-valley-blue-600'
    },
    {
      icon: Sprout,
      title: 'Small Plots, Big Dreams',
      value: '0.27 ha',
      description: 'Average family plot size (≈5¼ ropani)',
      story: 'Perfect size to start your journey - not too big, not too small',
      color: 'text-farm-green-600'
    }
  ]

  const opportunities = [
    {
      title: 'People Want Real Food',
      description: 'Growing demand for organic, locally-grown food',
      icon: '🌱'
    },
    {
      title: 'Land is Available',
      description: 'Idle plots waiting for passionate farmers',
      icon: '🏔️'
    },
    {
      title: 'Community is Growing',
      description: 'Young people choosing sustainable living',
      icon: '🤝'
    },
    {
      title: 'Knowledge is Here',
      description: 'Traditional farming wisdom combined with modern organic techniques',
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
            The Story of Our Land
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Generations of farmers. Fresh eyes. New chapter.
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
            The Time is Now
          </h3>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Everything is aligning for young people who want to live differently. 
            The land is calling, the community is ready, and the world needs what we can grow.
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
              Will You Answer the Call?
            </h3>
            <p className="text-xl mb-8 text-green-100">
              The land is waiting for someone who will love it, care for it, and grow with it. 
              That someone could be you.
            </p>
            <button className="bg-white text-farm-green-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Explore Your Options
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ContextSection 