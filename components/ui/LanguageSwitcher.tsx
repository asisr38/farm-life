import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LanguageSwitcher = () => {
  const pathname = usePathname()
  
  // Check if we're on a Nepali route
  const isNepali = pathname.startsWith('/ne')
  
  // Construct the target URL
  let targetUrl: string
  
  if (isNepali) {
    // Currently on Nepali, switch to English
    // Remove /ne prefix, default to / if empty
    const pathWithoutNe = pathname.replace(/^\/ne/, '') || '/'
    targetUrl = pathWithoutNe
  } else {
    // Currently on English, switch to Nepali
    targetUrl = `/ne${pathname}`
  }

  return (
    <Link
      href={targetUrl}
      className="px-3 py-1 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
    >
      {isNepali ? 'English' : 'नेपाली'}
    </Link>
  )
}

export default LanguageSwitcher 