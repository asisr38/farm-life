'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle, Circle, AlertTriangle, ArrowRight, Calendar, Target, MapPin, Zap } from 'lucide-react'
import { GOALS, PHASES, ZONES, RISKS, NEXT_STEPS } from '@/lib/constants'
import { getRiskSeverityColor } from '@/lib/utils'

export default function MyPath() {
  const [activePhase, setActivePhase] = useState(0)
  const [completedPhases, setCompletedPhases] = useState<number[]>([])

  const togglePhaseCompletion = (phaseIndex: number) => {
    setCompletedPhases(prev => 
      prev.includes(phaseIndex) 
        ? prev.filter(i => i !== phaseIndex)
        : [...prev, phaseIndex]
    )
  }

  const timelineSteps = [
    {
      id: 1,
      title: "Clarify Your Why",
      subtitle: "Set measurable goals",
      duration: "Week 1-2",
      icon: Target,
      color: "from-purple-500 to-purple-600",
      description: "Define your vision with concrete, measurable targets"
    },
    {
      id: 2,
      title: "Legal Foundation",
      subtitle: "Paperwork & permissions",
      duration: "Month 1-2",
      icon: CheckCircle,
      color: "from-blue-500 to-blue-600",
      description: "Get your legal ducks in a row while still in the U.S."
    },
    {
      id: 3,
      title: "Find Your Land",
      subtitle: "Secure the perfect plot",
      duration: "Month 1-6",
      icon: MapPin,
      color: "from-green-500 to-green-600",
      description: "Locate and secure 15-25km from Ring Road"
    },
    {
      id: 4,
      title: "Design Your System",
      subtitle: "Plan the farm layout",
      duration: "Month 4-9",
      icon: Circle,
      color: "from-yellow-500 to-yellow-600",
      description: "Zone your 5 ropani for maximum efficiency"
    },
    {
      id: 5,
      title: "Phase Implementation",
      subtitle: "Build step by step",
      duration: "Month 1-36",
      icon: Zap,
      color: "from-red-500 to-red-600",
      description: "Execute your 4-phase development plan"
    },
    {
      id: 6,
      title: "Community Building",
      subtitle: "Connect & grow together",
      duration: "Ongoing",
      icon: CheckCircle,
      color: "from-indigo-500 to-indigo-600",
      description: "Build networks and teaching opportunities"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Hero Section with Timeline Preview */}
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
              <Calendar className="w-4 h-4 mr-2" />
              3-Year Transformation Journey
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Path to Freedom
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              From U.S. software developer to sustainable homestead owner in Kathmandu Valley—
              a step-by-step roadmap that transforms dreams into reality.
            </p>
          </motion.div>

          {/* Timeline Overview */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
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

      {/* Main Timeline Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Goals Section - Step 1 */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-200 via-blue-200 via-green-200 via-yellow-200 via-red-200 to-indigo-200"></div>
              
              {timelineSteps.map((step, stepIndex) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: stepIndex * 0.2 }}
                  viewport={{ once: true }}
                  className="relative mb-16 last:mb-0"
                >
                  {/* Timeline Node */}
                  <div className={`absolute left-6 w-4 h-4 rounded-full bg-gradient-to-r ${step.color} 
                    border-4 border-white shadow-lg z-10`}></div>
                  
                  {/* Content Card */}
                  <div className="ml-20">
                    <motion.div
                      className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 p-8
                        ${activePhase === stepIndex ? 'border-green-200 shadow-xl scale-[1.02]' : 'border-gray-100 hover:border-gray-200 hover:shadow-xl'}`}
                      onHoverStart={() => setActivePhase(stepIndex)}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full mr-3">
                              {step.duration}
                            </span>
                            <span className="text-sm text-gray-500">Step {step.id}</span>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h2>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                        <motion.button
                          onClick={() => togglePhaseCompletion(stepIndex)}
                          className={`p-2 rounded-full transition-colors duration-200 ${
                            completedPhases.includes(stepIndex) 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </motion.button>
                      </div>

                      {/* Step-specific Content */}
                      {stepIndex === 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {GOALS.map((goal, goalIndex) => (
                            <motion.div
                              key={goalIndex}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: goalIndex * 0.1 }}
                              viewport={{ once: true }}
                              className={`p-4 rounded-xl border-2 ${goal.color}`}
                            >
                              <div className="flex items-center mb-3">
                                <goal.icon className="w-5 h-5 mr-2 text-gray-700" />
                                <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                              </div>
                              <p className="text-lg font-bold text-green-600 mb-1">{goal.target}</p>
                              <p className="text-sm text-gray-600">{goal.description}</p>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {stepIndex === 4 && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {PHASES.map((phase, phaseIndex) => (
                              <motion.div
                                key={phaseIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: phaseIndex * 0.1 }}
                                viewport={{ once: true }}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                                  ${activePhase === phaseIndex ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                              >
                                <div className={`w-8 h-8 rounded-lg ${phase.color} text-white flex items-center justify-center mb-3 text-sm font-bold`}>
                                  {phaseIndex + 1}
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">{phase.title}</h4>
                                <p className="text-xs text-gray-600 mb-2">Months {phase.months}</p>
                                <p className="text-sm font-bold text-green-600">{phase.budget}</p>
                                <p className="text-xs text-gray-500 mt-1">{phase.output}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {stepIndex === 3 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {ZONES.map((zone, zoneIndex) => (
                            <motion.div
                              key={zoneIndex}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: zoneIndex * 0.1 }}
                              viewport={{ once: true }}
                              className={`p-4 rounded-xl border-2 ${zone.color}`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-semibold text-gray-900">
                                  Zone {String.fromCharCode(65 + zoneIndex)} – {zone.name}
                                </h4>
                                <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded">
                                  {zone.size}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{zone.functions}</p>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Action Button */}
                      <motion.div 
                        className="mt-6 flex justify-end"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        <button className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-medium">
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Risk Assessment with Timeline Context */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Challenges Along the Path
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every journey has obstacles. Here's how to navigate them and grow stronger.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {RISKS.map((risk, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${getRiskSeverityColor(risk.severity)} bg-opacity-10`}>
                    <AlertTriangle className={`w-5 h-5 ${getRiskSeverityColor(risk.severity)}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{risk.risk}</h3>
                    <p className="text-sm text-gray-600 mb-3">{risk.mitigation}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      risk.severity === 'low' ? 'bg-green-100 text-green-800' :
                      risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)} Risk
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Steps - Action Timeline */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-blue-600 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Begin?</h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Your transformation starts with these immediate action steps.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {NEXT_STEPS.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="text-2xl font-bold text-white mb-2">{index + 1}</div>
                  <h3 className="font-semibold text-white mb-3">{step.action}</h3>
                  <p className="text-green-100 text-sm mb-4">{step.description}</p>
                  <div className="text-xs text-green-200 font-medium">
                    Timeline: {step.timeline}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <button className="bg-white text-green-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl transition-colors duration-200 text-lg">
              Start Your Journey Today
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 