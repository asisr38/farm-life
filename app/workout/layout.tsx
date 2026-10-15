import Navigation from '@/components/Navigation'

export default function WorkoutLayout({
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
