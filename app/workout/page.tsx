import WorkoutTracker from '@/components/workout/WorkoutTracker'

export const metadata = {
  title: 'Workout Tracker',
  description: 'Track workouts, sets, and rest. Load your plan CSV exported from Numbers.'
}

export default function Page() {
  return (
    <main className="pt-20 pb-10">
      <WorkoutTracker />
    </main>
  )
}


