'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, ExternalLink, BookOpen, Users, Leaf, Heart, Sprout } from 'lucide-react'
import { useState } from 'react'

const ContactSection = () => {
  const resources = [
    {
      name: 'National Statistics Office',
      description: 'Learn about farming trends and opportunities in your area',
      icon: BookOpen,
      link: '#',
      category: 'Knowledge'
    },
    {
      name: 'Department of Foreign Employment',
      description: 'Understand why young people are leaving and how you can stay',
      icon: Users,
      link: '#',
      category: 'Insights'
    },
    {
      name: 'Nepal Permaculture Group',
      description: 'Free training in organic farming and sustainable living',
      icon: Leaf,
      link: '#',
      category: 'Learning'
    },
    {
      name: 'LI-BIRD & ICIMOD',
      description: 'Learn about climate-smart farming techniques',
      icon: BookOpen,
      link: '#',
      category: 'Learning'
    },
    {
      name: 'Kathmandu Valley Farmers\' Network (KVFN)',
      description: 'Connect with other farmers, share tools and knowledge',
      icon: Users,
      link: '#',
      category: 'Community'
    },
    {
      name: 'Le Sherpa Market (Lazimpat)',
      description: 'A place to sell your harvest and meet food lovers',
      icon: Leaf,
      link: '#',
      category: 'Market'
    },
    {
      name: 'Yellow House Market (Patan)',
      description: 'Another wonderful market for organic produce',
      icon: Leaf,
      link: '#',
      category: 'Market'
    }
  ]

  const categories = ['All', 'Knowledge', 'Insights', 'Learning', 'Community', 'Market']
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredResources = selectedCategory === 'All' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory)

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
            Your Community Awaits
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            You're not alone on this journey. Connect with people who share your dreams, 
            organizations that can help you grow, and places where your harvest will find a home.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-farm-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card group hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-farm-green-100 text-farm-green-600 flex-shrink-0">
                  <resource.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-farm-green-600 transition-colors">
                      {resource.name}
                    </h3>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-farm-green-600 transition-colors" />
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {resource.description}
                  </p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {resource.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-farm-green-50 to-valley-blue-50 rounded-2xl p-8 lg:p-12"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Let's Start a Conversation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-farm-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-farm-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Email</h4>
              <p className="text-gray-600">hello@kathmanduvalleyfarm.com</p>
              <p className="text-sm text-gray-500">Share your dreams with us</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-valley-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-valley-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Phone</h4>
              <p className="text-gray-600">+977-1-4XXXXXX</p>
              <p className="text-sm text-gray-500">Let's talk about your journey</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-earth-brown-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-earth-brown-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Location</h4>
              <p className="text-gray-600">Kathmandu Valley, Nepal</p>
              <p className="text-sm text-gray-500">Where dreams take root</p>
            </div>
          </div>
        </motion.div>

        {/* Community Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-farm-green-600 to-valley-blue-600 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Join Our Growing Community
            </h3>
            <p className="text-xl mb-8 text-green-100">
              Every week, more young people are choosing to live differently. They're choosing 
              to grow their own food, build meaningful relationships, and create a life that 
              nourishes their soul. You can be one of them.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <Heart className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Follow Your Heart</p>
              </div>
              <div>
                <Sprout className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Start Small</p>
              </div>
              <div>
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Build Community</p>
              </div>
              <div>
                <Leaf className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Grow Together</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gray-900 text-white rounded-2xl p-8 lg:p-12">
            <h3 className="text-3xl font-bold mb-4">
              The Land is Calling
            </h3>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              There's a piece of land in Kathmandu Valley waiting for someone who will love it, 
              care for it, and grow with it. That someone could be you. The time to start your 
              journey is now. The land doesn't give up easily, and neither should you. 
              Your resilience will inspire others, and your harvest will nourish your community.
            </p>
            <div className="text-sm text-gray-400">
              Your journey begins today • July 28, 2025
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactSection 