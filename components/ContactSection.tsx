'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, ExternalLink, BookOpen, Users, Leaf, Heart, Sprout, Send } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { t } from '@/lib/intl'

const ContactSection = () => {
  const pathname = usePathname()
  const locale = pathname.startsWith('/ne') ? 'ne' : 'en'

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleFormChange = (field: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Create mailto link for now - can be replaced with actual form submission later
      const subject = encodeURIComponent('Farm Life Inquiry from ' + contactForm.name)
      const body = encodeURIComponent(`
Name: ${contactForm.name}
Email: ${contactForm.email}

Message:
${contactForm.message}
      `)
      
      window.location.href = `mailto:hello@kathmanduvalleyfarm.com?subject=${subject}&body=${body}`
      
      setSubmitStatus('success')
      setContactForm({ name: '', email: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus('idle'), 3000)
    }
  }

  const resources = [
    {
      name: 'National Statistics Office',
      description: 'Learn about farming trends and opportunities in your area',
      icon: BookOpen,
      link: 'https://cbs.gov.np/',
      category: 'Knowledge'
    },
    {
      name: 'Department of Foreign Employment',
      description: 'Understand why young people are leaving and how you can stay',
      icon: Users,
      link: 'https://dofe.gov.np/',
      category: 'Insights'
    },
    {
      name: 'Nepal Permaculture Group',
      description: 'Free training in organic farming and sustainable living',
      icon: Leaf,
      link: 'https://www.facebook.com/NepalPermacultureGroup/',
      category: 'Learning'
    },
    {
      name: 'LI-BIRD & ICIMOD',
      description: 'Learn about climate-smart farming techniques',
      icon: BookOpen,
      link: 'https://www.icimod.org/',
      category: 'Learning'
    },
    {
      name: 'Kathmandu Valley Farmers\' Network (KVFN)',
      description: 'Connect with farmers 🤝 Share knowledge',
      icon: Users,
      link: 'https://nfgf.org.np/',
      category: 'Community'
    },
    {
      name: 'Le Sherpa Market (Lazimpat)',
      description: 'Sell harvest 🥕 Meet food lovers',
      icon: Leaf,
      link: 'https://goo.gl/maps/LeSherpaLazimpat',
      category: 'Market'
    },
    {
      name: 'Yellow House Market (Patan)',
      description: 'Organic produce market 🌱',
      icon: Leaf,
      link: 'https://goo.gl/maps/x1xX6h7u5eQVTyBe7',
      category: 'Market'
    }
  ]

  const categories = ['All', 'Knowledge', 'Insights', 'Learning', 'Community', 'Market']
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredResources = selectedCategory === 'All' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory)

  const handleResourceClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }

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
            {t('contact_title', locale as any)}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t('contact_subtitle', locale as any)}
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
              className="card group hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => handleResourceClick(resource.link)}
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

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-farm-green-50 to-valley-blue-50 rounded-2xl p-8 lg:p-12 mb-16"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t('contact_form_title', locale as any)}
          </h3>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact_name', locale as any)}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farm-green-500 focus:border-transparent transition-colors"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact_email', locale as any)}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={contactForm.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farm-green-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact_message', locale as any)}
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => handleFormChange('message', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farm-green-500 focus:border-transparent transition-colors resize-none"
                  placeholder={t('contact_message_placeholder', locale as any)}
                  required
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-8 py-3 bg-gradient-to-r from-farm-green-600 to-farm-green-700 text-white font-semibold rounded-lg transition-all duration-200 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-farm-green-700 hover:to-farm-green-800 hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {isSubmitting ? t('contact_sending', locale as any) : t('contact_send', locale as any)}
                </button>
                {submitStatus === 'success' && (
                  <p className="text-green-600 text-sm mt-2">{t('contact_success', locale as any)}</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-600 text-sm mt-2">{t('contact_error', locale as any)}</p>
                )}
              </div>
            </form>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-farm-green-50 to-valley-blue-50 rounded-2xl p-8 lg:p-12 mb-16"
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

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-gray-100 mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated on Your Journey</h3>
            <p className="text-lg text-gray-600">Get inspiring stories, practical tips, and updates from fellow farm dreamers</p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farm-green-500 focus:border-transparent transition-colors"
              />
              <button 
                onClick={() => {
                  // For now, just show an alert - can be replaced with actual newsletter service
                  alert('Newsletter signup coming soon! For now, contact us directly at hello@kathmanduvalleyfarm.com')
                }}
                className="bg-gradient-to-r from-farm-green-600 to-farm-green-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-farm-green-700 hover:to-farm-green-800 transition-all duration-200"
              >
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              No spam, just inspiration. Unsubscribe anytime.
            </p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-8">
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
            {/* Social Media Links */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.open('https://www.facebook.com/KathmanduValleyFarm', '_blank')}
                className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors duration-200"
                aria-label="Follow us on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button
                onClick={() => window.open('https://www.instagram.com/KathmanduValleyFarm', '_blank')}
                className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors duration-200"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </button>
              <button
                onClick={() => window.open('https://www.youtube.com/@KathmanduValleyFarm', '_blank')}
                className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors duration-200"
                aria-label="Subscribe to our YouTube channel"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </button>
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