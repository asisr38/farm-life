import { ReactNode } from 'react'
import MyPathLayout from '../../my-path/layout'

export default function LocaleMyPathLayout({
  children,
}: {
  children: ReactNode
}) {
  return <MyPathLayout>{children}</MyPathLayout>
}
