'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Heart, TrendingUp, Sprout, Calendar, Users } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const FinancialCalculator = () => {
  const [inputs, setInputs] = useState({
    landSize: 5, // ropani
    pathType: 'simple-lease',
    leaseRate: 1.2, // lakh per ropani per year
    cropYield: 14, // lakh per year
    operatingCost: 9.5, // lakh per year
    setupCost: 9 // lakh
  })

  const handleInputChange = (field: string, value: number | string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Calculate your journey projections
  const calculateJourney = () => {
    const { landSize, leaseRate, cropYield, operatingCost, setupCost } = inputs
    
    const annualLeaseCost = landSize * leaseRate
    const year1Harvest = cropYield * 0.4 // 40% of full capacity in year 1
    const year2Harvest = cropYield * 0.8 // 80% of full capacity in year 2
    const year3Harvest = cropYield // Full capacity in year 3

    const year1Expenses = operatingCost * 0.6 + annualLeaseCost + setupCost
    const year2Expenses = operatingCost * 0.8 + annualLeaseCost
    const year3Expenses = operatingCost + annualLeaseCost

    const year1Balance = year1Harvest - year1Expenses
    const year2Balance = year2Harvest - year2Expenses
    const year3Balance = year3Harvest - year3Expenses

    return [
      { year: 'Year 1', harvest: year1Harvest, expenses: year1Expenses, balance: year1Balance, cumulative: year1Balance },
      { year: 'Year 2', harvest: year2Harvest, expenses: year2Expenses, balance: year2Balance, cumulative: year1Balance + year2Balance },
      { year: 'Year 3', harvest: year3Harvest, expenses: year3Expenses, balance: year3Balance, cumulative: year1Balance + year2Balance + year3Balance }
    ]
  }

  const journey = calculateJourney()

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
            Your Journey to Financial Freedom
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            This isn't about getting rich—it's about building a life where your work sustains you 
            and your family. Use this tool to understand your path to financial independence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Heart className="h-6 w-6 mr-2" />
                Your Dream Parameters
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land Size (Ropani)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={inputs.landSize}
                    onChange={(e) => handleInputChange('landSize', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1 Ropani</span>
                    <span className="font-medium text-gray-900">{inputs.landSize} Ropani</span>
                    <span>25 Ropani</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Path
                  </label>
                  <select
                    value={inputs.pathType}
                    onChange={(e) => handleInputChange('pathType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-farm-green-500"
                  >
                    <option value="simple-lease">Simple Land Lease</option>
                    <option value="shared-harvest">Shared Harvest</option>
                    <option value="lease-to-own">Lease with Future Ownership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Land Cost (Lakh/Ropani/Year)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.leaseRate}
                    onChange={(e) => handleInputChange('leaseRate', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-farm-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Harvest Potential (Lakh/Year at Full Capacity)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={inputs.cropYield}
                    onChange={(e) => handleInputChange('cropYield', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-farm-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Living & Farm Costs (Lakh/Year at Full Capacity)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={inputs.operatingCost}
                    onChange={(e) => handleInputChange('operatingCost', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-farm-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Setup Investment (Lakh)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={inputs.setupCost}
                    onChange={(e) => handleInputChange('setupCost', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-farm-green-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Journey Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {journey.map((year, index) => (
                <div key={index} className="card text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {year.year}
                  </div>
                  <div className={`text-lg font-semibold ${
                    year.balance >= 0 ? 'text-farm-green-600' : 'text-red-600'
                  }`}>
                    {year.balance >= 0 ? '+' : ''}{year.balance.toFixed(1)} Lakh
                  </div>
                  <div className="text-sm text-gray-500">Your Balance</div>
                </div>
              ))}
            </div>

            {/* Journey Chart */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Your Journey to Independence
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={journey}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)} Lakh`, '']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="harvest" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      name="Your Harvest"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Your Costs"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Your Balance"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Insights */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Sprout className="h-5 w-5 mr-2" />
                Your Path to Freedom
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Investment (Year 1)</span>
                  <span className="font-semibold text-gray-900">
                    {(inputs.setupCost + inputs.landSize * inputs.leaseRate).toFixed(1)} Lakh
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">When You'll Break Even</span>
                  <span className="font-semibold text-gray-900">
                    {journey[1].cumulative >= 0 ? 'Year 2' : 'Year 3+'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">3-Year Total Balance</span>
                  <span className={`font-semibold ${
                    journey[2].cumulative >= 0 ? 'text-farm-green-600' : 'text-red-600'
                  }`}>
                    {journey[2].cumulative >= 0 ? '+' : ''}{journey[2].cumulative.toFixed(1)} Lakh
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Your Return on Investment</span>
                  <span className={`font-semibold ${
                    journey[2].cumulative >= 0 ? 'text-farm-green-600' : 'text-red-600'
                  }`}>
                    {((journey[2].cumulative / (inputs.setupCost + inputs.landSize * inputs.leaseRate)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

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
              Remember What Matters
            </h3>
            <p className="text-xl mb-8 text-green-100">
              These numbers are just a guide. The real value is in the life you'll build— 
              the food you'll grow, the community you'll create, and the peace you'll find 
              in living close to the earth.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Heart className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Follow Your Heart</p>
              </div>
              <div>
                <Sprout className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Start Small, Dream Big</p>
              </div>
              <div>
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Build Community</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FinancialCalculator 