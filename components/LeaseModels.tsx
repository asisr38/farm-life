'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Check, X, Heart, Users, Home, Sprout, Leaf } from 'lucide-react'

const LeaseModels = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  const paths = [
    {
      id: 'simple-lease',
      name: 'Simple Land Lease',
      icon: Heart,
      description: 'Rent a plot and keep everything you grow',
      bestFor: 'Start simple, learn as you go',
      keyConsideration: 'Make sure you have a 5-year renewal option',
      pros: ['Start with minimal commitment', 'Keep all your harvest', 'Simple and straightforward'],
      cons: ['Higher upfront costs', 'All responsibility is yours', 'No shared benefits'],
      color: 'border-farm-green-500'
    },
    {
      id: 'shared-harvest',
      name: 'Shared Harvest (Bataiya)',
      icon: Users,
      description: 'Split your harvest with the landowner (usually 50:50)',
      bestFor: 'Start with less money, share the journey',
      keyConsideration: 'Be clear about who pays for what',
      pros: ['Lower upfront costs', 'Shared risk and reward', 'Traditional approach'],
      cons: ['Share your harvest', 'More complex arrangements', 'Potential disagreements'],
      color: 'border-valley-blue-500'
    },
    {
      id: 'lease-to-own',
      name: 'Lease with Future Ownership',
      icon: Home,
      description: 'Part of your rent goes toward eventually buying the land',
      bestFor: 'Test before buying, build equity',
      keyConsideration: 'Understand the tax implications',
      pros: ['Path to permanent home', 'Test before buying', 'Build equity over time'],
      cons: ['More complex structure', 'Higher total cost', 'Legal complexity'],
      color: 'border-earth-brown-500'
    },
    {
      id: 'community-farm',
      name: 'Community Farm Partnership',
      icon: Sprout,
      description: 'Join with others to farm larger areas together',
      bestFor: 'Community-focused, shared resources',
      keyConsideration: 'Clear communication and shared decision-making',
      pros: ['Shared resources and knowledge', 'Stronger community presence', 'Distributed risk'],
      cons: ['Complex coordination', 'Shared decision making', 'Potential conflicts'],
      color: 'border-farm-green-500'
    },
    {
      id: 'learning-farm',
      name: 'Learning Farm Program',
      icon: Leaf,
      description: 'Work with experienced farmers to learn while you grow',
      bestFor: 'Those who want mentorship and guidance on their journey',
      keyConsideration: 'Find the right mentor and clear learning goals',
      pros: ['Learn from experience', 'Reduced risk', 'Built-in support network'],
      cons: ['Less independence', 'May take longer to learn', 'Dependent on mentor'],
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
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Choose Your Path
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            There's no one right way to start your farming journey. Each path offers different 
            benefits and challenges. Choose the one that feels right for your heart and your situation.
          </p>
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
                  <span className="text-sm font-medium text-gray-500">Best for:</span>
                  <p className="text-sm text-gray-700">{path.bestFor}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Consider:</span>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedPathData.name}
                </h3>
                <p className="text-gray-600 mb-6">{selectedPathData.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Best for:</h4>
                    <p className="text-gray-600">{selectedPathData.bestFor}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key consideration:</h4>
                    <p className="text-gray-600">{selectedPathData.keyConsideration}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Check className="h-5 w-5 text-farm-green-600 mr-2" />
                    What You'll Love
                  </h4>
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
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <X className="h-5 w-5 text-red-600 mr-2" />
                    Challenges to Consider
                  </h4>
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