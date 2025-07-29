'use client'

import { motion } from 'framer-motion'
import { Heart, Sprout, Users, Home } from 'lucide-react'

const ExecutiveSummary = () => {
  const reasons = [
    {
      icon: Heart,
      title: 'Live with Purpose',
      description: 'Connect with the land and discover what truly matters. Grow food that nourishes your body and soul, while building a life that aligns with your values.',
      color: 'text-farm-green-600'
    },
    {
      icon: Sprout,
      title: 'Learn by Doing',
      description: 'Start small and grow with confidence. Leasing land lets you learn organic farming without the pressure of huge investments. Every mistake is a lesson, every harvest a victory.',
      color: 'text-valley-blue-600'
    },
    {
      icon: Users,
      title: 'Build Community',
      description: 'Join a network of like-minded people who care about sustainable living. Share knowledge, tools, and the joy of growing together. You\'ll never feel alone on this journey.',
      color: 'text-earth-brown-600'
    },
    {
      icon: Home,
      title: 'Create Your Home',
      description: 'Transform a simple plot into your sanctuary. Build a life where work and passion merge, where every day brings you closer to the earth and to yourself.',
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
            Why This Matters
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            This isn't just about farming—it's about creating a life that feels right. 
            A life where you wake up knowing you're making a difference, where your work 
            feeds both your family and your soul. Here's why this journey could change everything.
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
            Your Journey to a Meaningful Life
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-farm-green-600 mb-2">Year 1</div>
              <div className="text-lg text-gray-600">Learning & Growing</div>
              <div className="text-2xl font-semibold text-gray-900 mt-2">-3 Lakh NPR</div>
              <div className="text-sm text-gray-500">Investment in your future</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-valley-blue-600 mb-2">Year 2</div>
              <div className="text-lg text-gray-600">Finding Your Rhythm</div>
              <div className="text-2xl font-semibold text-gray-900 mt-2">+4.5 Lakh NPR</div>
              <div className="text-sm text-gray-500">Your first harvest of success</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-earth-brown-600 mb-2">Year 3</div>
              <div className="text-lg text-gray-600">Living Your Dream</div>
              <div className="text-2xl font-semibold text-gray-900 mt-2">+6 Lakh NPR</div>
              <div className="text-sm text-gray-500">A sustainable, fulfilling life</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ExecutiveSummary 