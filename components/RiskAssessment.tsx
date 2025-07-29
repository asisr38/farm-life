'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Heart, Droplets, Users, Shield, CheckCircle, Sprout } from 'lucide-react'

const RiskAssessment = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null)

  const challenges = [
    {
      id: 'water-challenge',
      title: 'Water Scarcity (Mar–May)',
      icon: Droplets,
      impact: 'High',
      likelihood: 'Medium',
      description: 'The dry season can test your patience and creativity',
      growth: [
        'Learn to harvest and store rainwater',
        'Discover drought-resistant crops that thrive here',
        'Build relationships with neighbors who can help',
        'Develop water-wise farming techniques',
        'Appreciate every drop of rain even more'
      ],
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'market-challenge',
      title: 'Market Fluctuations',
      icon: Users,
      impact: 'Medium',
      likelihood: 'High',
      description: 'Prices can change, but your community will support you',
      growth: [
        'Build direct relationships with your customers',
        'Create a CSA (Community Supported Agriculture) program',
        'Diversify what you grow to spread risk',
        'Focus on quality over quantity',
        'Learn that true value isn\'t just in money'
      ],
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'land-challenge',
      title: 'Land Security',
      icon: Shield,
      impact: 'High',
      likelihood: 'Low',
      description: 'Sometimes land can change hands, but you\'ll adapt',
      growth: [
        'Build strong relationships with landowners',
        'Include options to buy in your agreements',
        'Choose locations that feel stable and right',
        'Stay connected to your community',
        'Trust that the right land will find you'
      ],
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'labor-challenge',
      title: 'Finding Help',
      icon: Heart,
      impact: 'Medium',
      likelihood: 'High',
      description: 'Good help can be hard to find, but community grows',
      growth: [
        'Learn to work smarter, not just harder',
        'Connect with WWOOF volunteers who want to learn',
        'Build relationships with local workers',
        'Create a place where people want to work',
        'Discover the joy of working with your hands'
      ],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ]

  const selectedChallengeData = challenges.find(challenge => challenge.id === selectedChallenge)

  const getGrowthLevel = (impact: string, likelihood: string) => {
    if (impact === 'High' && likelihood === 'High') return 'Major Growth Opportunity'
    if (impact === 'High' || likelihood === 'High') return 'Significant Learning'
    if (impact === 'Medium' && likelihood === 'Medium') return 'Moderate Challenge'
    return 'Minor Hurdle'
  }

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
            Challenges That Make You Stronger
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Every journey has its challenges, but these are opportunities to grow, learn, and become 
            the person you're meant to be. Here's how to face them with courage and wisdom.
          </p>
        </motion.div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`card cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedChallenge === challenge.id ? 'ring-2 ring-farm-green-500' : ''
              }`}
              onClick={() => setSelectedChallenge(challenge.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${challenge.bgColor} ${challenge.color} flex-shrink-0`}>
                  <challenge.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {challenge.description}
                  </p>
                  <div className="flex space-x-4 text-sm">
                    <span className="text-gray-500">
                      Impact: <span className="font-medium text-gray-900">{challenge.impact}</span>
                    </span>
                    <span className="text-gray-500">
                      Likelihood: <span className="font-medium text-gray-900">{challenge.likelihood}</span>
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      getGrowthLevel(challenge.impact, challenge.likelihood) === 'Major Growth Opportunity' ? 'bg-purple-100 text-purple-800' :
                      getGrowthLevel(challenge.impact, challenge.likelihood) === 'Significant Learning' ? 'bg-blue-100 text-blue-800' :
                      getGrowthLevel(challenge.impact, challenge.likelihood) === 'Moderate Challenge' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      <Sprout className="h-3 w-3 mr-1" />
                      {getGrowthLevel(challenge.impact, challenge.likelihood)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Challenge View */}
        {selectedChallengeData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Challenge Details */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Heart className="h-6 w-6 mr-2 text-farm-green-600" />
                  {selectedChallengeData.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedChallengeData.description}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">How it might affect you:</span>
                    <span className="font-semibold text-gray-900">{selectedChallengeData.impact}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">How likely it is:</span>
                    <span className="font-semibold text-gray-900">{selectedChallengeData.likelihood}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Growth opportunity:</span>
                    <span className={`font-semibold ${
                      getGrowthLevel(selectedChallengeData.impact, selectedChallengeData.likelihood) === 'Major Growth Opportunity' ? 'text-purple-600' :
                      getGrowthLevel(selectedChallengeData.impact, selectedChallengeData.likelihood) === 'Significant Learning' ? 'text-blue-600' :
                      getGrowthLevel(selectedChallengeData.impact, selectedChallengeData.likelihood) === 'Moderate Challenge' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {getGrowthLevel(selectedChallengeData.impact, selectedChallengeData.likelihood)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Growth Strategies */}
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Sprout className="h-5 w-5 mr-2 text-farm-green-600" />
                  How You'll Grow Through This
                </h4>
                <ul className="space-y-3">
                  {selectedChallengeData.growth.map((strategy, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-farm-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Resilience Framework */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-farm-green-50 to-valley-blue-50 rounded-2xl p-8 lg:p-12"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Building Your Resilience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Accept</h4>
              <p className="text-gray-600 text-sm">Embrace challenges as part of your growth</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Adapt</h4>
              <p className="text-gray-600 text-sm">Learn new ways to overcome obstacles</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Persist</h4>
              <p className="text-gray-600 text-sm">Keep going even when it's hard</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Thrive</h4>
              <p className="text-gray-600 text-sm">Become stronger through every challenge</p>
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
          <div className="bg-gradient-to-r from-farm-green-600 to-valley-blue-600 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              You Are Stronger Than You Know
            </h3>
            <p className="text-xl mb-8 text-green-100">
              Every challenge you face will make you wiser, every obstacle you overcome will make you stronger. 
              The land doesn't give up easily, and neither should you. Your resilience will inspire others.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Heart className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Trust Your Strength</p>
              </div>
              <div>
                <Sprout className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Grow Through Challenges</p>
              </div>
              <div>
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Lean on Community</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default RiskAssessment 