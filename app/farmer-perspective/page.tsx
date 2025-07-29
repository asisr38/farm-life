'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle, AlertTriangle, Target, MapPin, Zap, Users, Heart, DollarSign } from 'lucide-react'

export default function FarmerPerspective() {
  const [activePhase, setActivePhase] = useState(0)

  const farmerGoals = [
    {
      icon: DollarSign,
      title: 'Steady Income',
      target: '15-20% higher than traditional rent',
      description: 'Reliable monthly payments plus potential profit sharing',
      color: 'text-green-600'
    },
    {
      icon: Heart,
      title: 'Land Preservation',
      target: 'Maintain soil health & biodiversity',
      description: 'See your land flourish with organic practices',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Community Impact',
      target: 'Support local food systems',
      description: 'Be part of sustainable agriculture movement',
      color: 'text-purple-600'
    },
    {
      icon: Target,
      title: 'Legacy Building',
      target: 'Productive land for future generations',
      description: 'Create lasting value beyond monetary returns',
      color: 'text-orange-600'
    }
  ]

  const leaseTypes = [
    {
      title: 'Fixed Rent Model',
      income: 'NPR 1.2-1.8 Lakh/ropani/year',
      pros: ['Guaranteed income', 'No weather risk', 'Minimal involvement'],
      cons: ['Fixed returns', 'No upside potential'],
      bestFor: 'Hands-off landowners seeking stability',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Profit Sharing (50:50)',
      income: 'NPR 1.5-3 Lakh/ropani/year*',
      pros: ['Higher potential returns', 'Shared investment', 'Active partnership'],
      cons: ['Income variability', 'Weather dependency'],
      bestFor: 'Engaged farmers wanting partnership',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Lease-to-Own',
      income: 'NPR 2-4 Lakh/ropani/year',
      pros: ['Premium pricing', 'Eventual sale', 'Motivated tenants'],
      cons: ['Long-term commitment', 'Property transfer'],
      bestFor: 'Retirement planning or relocation',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const timelineSteps = [
    {
      id: 1,
      title: "Evaluate Your Land",
      subtitle: "Assess potential & value",
      duration: "Week 1-2",
      icon: MapPin,
      color: "from-green-500 to-green-600",
      description: "Understand your land's farming potential and market value"
    },
    {
      id: 2,
      title: "Choose Your Model",
      subtitle: "Pick the right partnership",
      duration: "Week 3-4",
      icon: Target,
      color: "from-blue-500 to-blue-600",
      description: "Select between fixed rent, profit sharing, or lease-to-own"
    },
    {
      id: 3,
      title: "Find the Right Partner",
      subtitle: "Screen potential lessees",
      duration: "Month 1-2",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      description: "Find committed, experienced farmers who share your values"
    },
    {
      id: 4,
      title: "Legal Protection",
      subtitle: "Secure your interests",
      duration: "Month 1",
      icon: CheckCircle,
      color: "from-orange-500 to-orange-600",
      description: "Draft comprehensive agreements protecting both parties"
    },
    {
      id: 5,
      title: "Monitor & Support",
      subtitle: "Ensure success together",
      duration: "Ongoing",
      icon: Zap,
      color: "from-red-500 to-red-600",
      description: "Stay involved to ensure land care and business success"
    }
  ]

  const considerations = [
    {
      title: 'Tenant Screening',
      description: 'Look for farming experience, financial stability, and commitment to organic practices',
      importance: 'Critical',
      color: 'border-red-200 bg-red-50'
    },
    {
      title: 'Soil Health Monitoring',
      description: 'Regular testing to ensure organic practices improve rather than deplete soil',
      importance: 'High',
      color: 'border-orange-200 bg-orange-50'
    },
    {
      title: 'Water Rights & Access',
      description: 'Clear agreements on water usage, source protection, and seasonal availability',
      importance: 'High',
      color: 'border-orange-200 bg-orange-50'
    },
    {
      title: 'Insurance Coverage',
      description: 'Protect against crop failure, natural disasters, and liability issues',
      importance: 'Medium',
      color: 'border-yellow-200 bg-yellow-50'
    }
  ]

  const successStories = [
    {
      location: "Budhanilkantha",
      size: "3 ropani",
      model: "Profit Sharing",
      income: "NPR 4.2 Lakh/year",
      story: "Ramu ji partnered with young organic farmers. His land now produces premium vegetables while earning 40% more than traditional rent."
    },
    {
      location: "Lele Valley", 
      size: "5 ropani",
      model: "Fixed Rent",
      income: "NPR 7.5 Lakh/year",
      story: "Sita didi leases to a permaculture collective. Steady income while watching her ancestral land become a thriving ecosystem."
    },
    {
      location: "Dhaksi",
      size: "2 ropani", 
      model: "Lease-to-Own",
      income: "NPR 6 Lakh/year",
      story: "Hari uncle found young farmers planning long-term settlement. Premium lease payments with eventual sale planned for retirement."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50"></div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
              <Heart className="w-4 h-4 mr-2" />
              The Landowner's Journey
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Land, Their Dreams
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Partner with passionate young farmers to transform your land into a thriving organic farm 
              while securing better returns and preserving your legacy.
            </p>
          </motion.div>

          {/* Timeline Overview */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
              {timelineSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center group cursor-pointer"
                  onClick={() => setActivePhase(index)}
                >
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${step.color} 
                    flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300
                    ${activePhase === index ? 'ring-4 ring-green-200 scale-110' : ''}`}>
                    <step.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-500">{step.duration}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Partner with Young Farmers?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform idle land into productive assets while supporting sustainable agriculture and your community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {farmerGoals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <goal.icon className={`w-8 h-8 mr-3 ${goal.color}`} />
                  <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                </div>
                <p className="text-lg font-bold text-green-600 mb-2">{goal.target}</p>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lease Models Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Choose Your Partnership Model</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Different models offer different benefits. Find the one that matches your goals and risk tolerance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaseTypes.map((lease, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${lease.color} text-white flex items-center justify-center mb-4`}>
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{lease.title}</h3>
                <p className="text-lg font-semibold text-green-600 mb-4">{lease.income}</p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Advantages:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {lease.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Considerations:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {lease.cons.map((con, idx) => (
                      <li key={idx} className="flex items-center">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Best for:</span> {lease.bestFor}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Considerations */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Protect Your Investment</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key areas to focus on when leasing your land for farming.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {considerations.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl border-2 ${item.color}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    item.importance === 'Critical' ? 'bg-red-100 text-red-700' :
                    item.importance === 'High' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.importance}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Real Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how other landowners have benefited from partnering with organic farmers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{story.location}</h3>
                    <p className="text-sm text-gray-600">{story.size} • {story.model}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{story.income}</p>
                    <p className="text-xs text-gray-500">Annual Income</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic">"{story.story}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-blue-600 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Land?</h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Join the sustainable agriculture movement while securing better returns for your land. 
              Connect with passionate young farmers today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl transition-colors duration-200 text-lg">
                Find Farmers Now
              </button>
              <button className="border-2 border-white text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-colors duration-200 text-lg">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 