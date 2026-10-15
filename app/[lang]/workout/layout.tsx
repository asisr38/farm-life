import { ReactNode } from 'react'
import WorkoutLayout from '../../workout/layout'

export default function LocaleWorkoutLayout({
  children,
}: {
  children: ReactNode
}) {
  return <WorkoutLayout>{children}</WorkoutLayout>
}
