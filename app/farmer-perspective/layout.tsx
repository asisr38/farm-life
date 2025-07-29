import Navigation from '@/components/Navigation'

export default function FarmerPerspectiveLayout({
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