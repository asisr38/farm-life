'use client'

import { motion } from 'framer-motion'
import { Heart, Sprout, Users, Mountain } from 'lucide-react'

interface HeroSectionProps {
  onGetStarted: () => void
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-farm-green-50 via-white to-valley-blue-50 pt-14 sm:pt-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-farm-green-200/30 to-valley-blue-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -120, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-valley-blue-200/30 to-earth-brown-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 right-1/3 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-earth-brown-200/20 to-farm-green-200/20 rounded-full blur-2xl"
        />
      </div>

      {/* Glass Morphism Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-medium text-gray-700 mb-8"
          >
            <Sprout className="h-4 w-4 mr-2 text-farm-green-600" />
            Sustainable Living • Community • Growth
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-farm-green-600 via-valley-blue-600 to-earth-brown-600 bg-clip-text text-transparent">
                Grow Your Future
              </span>
              <br />
              <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal text-gray-700 mt-2 sm:mt-4 block">
                in the Heart of Kathmandu Valley
              </span>
            </h1>
          </motion.div>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-gray-600 max-w-4xl mx-auto leading-relaxed font-light px-4"
          >
            Discover the joy of growing your own food, building community, and living sustainably 
            in one of the most beautiful places on earth. Your journey to a meaningful life starts here.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4"
          >
            <button
              onClick={onGetStarted}
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-farm-green-600 to-farm-green-700 text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-farm-green-500/25 flex items-center justify-center space-x-2"
            >
              <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Begin Your Journey</span>
            </button>
            <button className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/70 backdrop-blur-md border border-white/30 text-gray-700 font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80 hover:shadow-xl">
              Learn Our Story
            </button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4"
          >
            <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105">
              <div className="flex justify-center mb-3">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-farm-green-500 to-farm-green-600 rounded-lg sm:rounded-xl">
                  <Sprout className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">42%</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Families still connected to the land</div>
            </div>
            
            <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105">
              <div className="flex justify-center mb-3">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-valley-blue-500 to-valley-blue-600 rounded-lg sm:rounded-xl">
                  <Mountain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">0.27 ha</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">Average family plot - perfect to start</div>
            </div>
            
            <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/50 transition-all duration-300 hover:scale-105 sm:col-span-2 md:col-span-1">
              <div className="flex justify-center mb-3">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-earth-brown-500 to-earth-brown-600 rounded-lg sm:rounded-xl">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">20-50%</div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">More people choosing organic food</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modern Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="cursor-pointer group"
          onClick={onGetStarted}
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
              Discover More
            </span>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center group-hover:border-gray-400 transition-colors">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-3 bg-gradient-to-b from-farm-green-500 to-valley-blue-500 rounded-full mt-2"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection 