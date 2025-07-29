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
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-farm-green-600" />
            <span className="text-xl font-bold text-gray-900">{SITE_CONFIG.logo}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Page Navigation */}
            {PAGE_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-farm-green-600'
                    : 'text-gray-600 hover:text-farm-green-600'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Section Navigation (only on home page) */}
            {isHomePage && HOME_NAV_ITEMS.slice(1).map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeSection === item.id
                    ? 'text-farm-green-600'
                    : 'text-gray-600 hover:text-farm-green-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-farm-green-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Page Navigation */}
              {PAGE_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'bg-farm-green-50 text-farm-green-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-farm-green-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Section Navigation (only on home page) */}
              {isHomePage && HOME_NAV_ITEMS.slice(1).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeSection === item.id
                      ? 'bg-farm-green-50 text-farm-green-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-farm-green-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation 