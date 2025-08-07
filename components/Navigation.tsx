'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Leaf } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavigationProps } from '@/lib/types'
import { HOME_NAV_ITEMS, PAGE_NAV_ITEMS, SITE_CONFIG } from '@/lib/constants'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { t } from '@/lib/intl'

const Navigation = ({ activeSection, onNavigate }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showNav, setShowNav] = useState(true)
  const prevScrollPos = useRef(0)
  const pathname = usePathname()
  const isNepali = pathname.startsWith('/ne')
  const locale = isNepali ? 'ne' : 'en'
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      // shadow background after 50px
      setIsScrolled(window.scrollY > 50)

      // auto-hide / reveal logic
      const currentScrollPos = window.scrollY
      const scrollingDown = currentScrollPos > prevScrollPos.current

      // only toggle after small threshold to avoid jitter
      if (Math.abs(currentScrollPos - prevScrollPos.current) > 10) {
        if (scrollingDown && currentScrollPos > 100) {
          setShowNav(false)
        } else {
          setShowNav(true)
        }
        prevScrollPos.current = currentScrollPos
      }
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

  const isHomePage = pathname === '/' || pathname === '/ne'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transform transition-transform duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      } ${showNav ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo - More Prominent */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 group-hover:from-green-600 group-hover:to-green-700 transition-all duration-200">
              <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="block">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {SITE_CONFIG.logo}
              </span>
              <div className="text-xs text-gray-500 -mt-1 hidden sm:block">Sustainable Living</div>
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
                {t(`nav_${item.id === 'summary' ? 'why' : item.id === 'lease-models' ? 'path' : item.id === 'calculator' ? 'calculator' : item.id === 'action-plan' ? 'getstarted' : 'community'}`, locale as any)}
              </button>
            ))}
            
            {/* Language Switcher */}
            <LanguageSwitcher />

            {session ? (
              <>
                <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50">
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50">
                Login
              </Link>
            )}
            {/* CTA Button */}
            <Link
              href={isHomePage ? '#action-plan' : '/'}
              onClick={(e) => {
                if (isHomePage) {
                  e.preventDefault()
                  const element = document.getElementById('action-plan')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }
              }}
              className="ml-4 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isHomePage ? t('start_now', locale as any) : t('explore', locale as any)}
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
            <div className="px-3 pt-3 pb-4 space-y-2 bg-white/95 backdrop-blur-md rounded-xl mt-3 shadow-xl border border-gray-100 mx-2">
              {/* Mobile Page Navigation */}
              {PAGE_NAV_ITEMS.map((item) => (
                                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200 ${
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
                        className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200 ${
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
              <div className="pt-3">
                <Link
                  href={isHomePage ? '#action-plan' : '/'}
                  onClick={(e) => {
                    setIsMenuOpen(false)
                    if (isHomePage) {
                      e.preventDefault()
                      const element = document.getElementById('action-plan')
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' })
                      }
                    }
                  }}
                  className="block w-full text-center px-4 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-base font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
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