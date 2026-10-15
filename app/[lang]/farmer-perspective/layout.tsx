import { ReactNode } from 'react'
import FarmerPerspectiveLayout from '../../farmer-perspective/layout'

export default function LocaleFarmerPerspectiveLayout({
  children,
}: {
  children: ReactNode
}) {
  return <FarmerPerspectiveLayout>{children}</FarmerPerspectiveLayout>
}
