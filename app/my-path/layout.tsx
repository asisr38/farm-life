import Navigation from '@/components/Navigation'

export default function MyPathLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      {children}
    </>
  )
} 