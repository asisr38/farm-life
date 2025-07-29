'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Leaf } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavigationProps } from '@/lib/types'
import { HOME_NAV_ITEMS, PAGE_NAV_ITEMS, SITE_CONFIG } from '@/lib/constants'

const Navigation = ({ activeSection, onNavigate }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId)
    }
    setIsMenuOpen(false)
  }

  const isHomePage = pathname === '/'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - More Prominent */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-green-600 group-hover:from-green-600 group-hover:to-green-700 transition-all duration-200">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {SITE_CONFIG.logo}
              </span>
              <div className="text-xs text-gray-500 -mt-1">Sustainable Living</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Page Navigation */}
            {PAGE_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Section Navigation (only on home page) */}
            {isHomePage && HOME_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* CTA Button */}
            <Link
              href={isHomePage ? '#action-plan' : '/'}
              className="ml-4 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isHomePage ? 'Start Now' : 'Explore'}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg border border-gray-100">
              {/* Mobile Page Navigation */}
              {PAGE_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Section Navigation (only on home page) */}
              {isHomePage && (
                <>
                  <div className="h-px bg-gray-200 my-2"></div>
                  {HOME_NAV_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                        activeSection === item.id
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </>
              )}
              
              {/* Mobile CTA */}
              <div className="pt-2">
                <Link
                  href={isHomePage ? '#action-plan' : '/'}
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-3 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-base font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                >
                  {isHomePage ? 'Start Your Journey' : 'Explore Farm Life'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation 