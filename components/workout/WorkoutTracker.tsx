'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

type WorkoutRow = {
  id: string
  day: string
  phase?: string
  exercise: string
  sets: number
  reps: string
  restSeconds: number
  notes?: string
  link?: string
  warmupText?: string
  cooldownText?: string
  focus?: string
}

type ProgressEntry = {
  setsCompleted: number
  notes?: string
}

const STORAGE_KEY = 'workout_progress_v1'
const SESSION_KEY = 'workout_session_v1'
const SESSIONS_LOG_KEY = 'workout_sessions_log_v1'

type SessionState = {
  currentDayName: string
  accumulatedMs: number
  lastResumeAtMs?: number
  isPaused: boolean
}

const coerceNumber = (value: unknown, fallback = 0): number => {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'number' && Number.isFinite(value)) return Math.floor(value)
  const n = Number(String(value).replace(/[^0-9.]/g, ''))
  if (Number.isFinite(n)) return Math.floor(n)
  return fallback
}

const toRowsFromFlatArray = (
  arr: any[],
  dayHint?: string,
  phaseHint?: string,
  warmupHint?: string,
  cooldownHint?: string,
  focusHint?: string
): WorkoutRow[] => {
  let autoId = 0
  return arr
    .map((item) => {
      const day = item.day || item.date || dayHint || 'Day 1'
      const exercise = item.exercise || item.movement || item.name || item.workout
      let sets = coerceNumber(item.sets ?? item.set, NaN)
      let repsVal: any = item.reps ?? item.rep ?? item.scheme ?? item.sets_reps ?? ''
      if (!Number.isFinite(sets) && typeof repsVal === 'string') {
        const m = repsVal.match(/(\d+)\s*[xX]\s*([\dA-Za-z]+)/)
        if (m) {
          sets = coerceNumber(m[1], 3)
          repsVal = m[2]
        }
      }
      if (!Number.isFinite(sets)) sets = 3
      const reps = repsVal !== undefined && repsVal !== null ? String(repsVal) : '10'
      const restSeconds = coerceNumber(item.restSeconds ?? item.rest_s ?? item.rest ?? 60, 60)
      const notes = item.notes || item.comment || ''
      const phase = item.phase || phaseHint
      const link = item.how_to_link || item.link || undefined
      const warmupText = item.dynamic_warm_up || item.warmup || item.warm_up || warmupHint
      const cooldownText = item.cool_down || item.cooldown || item.cool || cooldownHint
      const focus = item.focus || focusHint
      return {
        id: `${day}-${exercise}-${autoId++}`,
        day,
        phase,
        exercise,
        sets,
        reps,
        restSeconds,
        notes,
        link,
        warmupText,
        cooldownText,
        focus,
      } as WorkoutRow
    })
    .filter((r) => r.exercise)
}

const toWorkoutRowsFromJson = (json: any): WorkoutRow[] => {
  if (Array.isArray(json)) {
    return toRowsFromFlatArray(json)
  }
  if (json && Array.isArray(json.plan)) {
    return toRowsFromFlatArray(json.plan)
  }
  if (json && json.days) {
    const days = json.days
    if (Array.isArray(days)) {
      const rows: WorkoutRow[] = []
      days.forEach((d: any, idx: number) => {
        const dayName = d.day || d.name || `Day ${idx + 1}`
        const list = d.exercises || d.items || d.workouts || []
        rows.push(
          ...toRowsFromFlatArray(
            list,
            dayName,
            d.phase,
            d.dynamic_warm_up || d.warmup || d.warm_up,
            d.cool_down || d.cooldown || d.cool,
            d.focus
          )
        )
      })
      return rows
    }
    if (typeof days === 'object') {
      const rows: WorkoutRow[] = []
      Object.keys(days).forEach((key) => {
        const list = days[key] || []
        rows.push(...toRowsFromFlatArray(list, key))
      })
      return rows
    }
  }
  if (json && Array.isArray(json.weeks)) {
    const rows: WorkoutRow[] = []
    json.weeks.forEach((week: any, wIdx: number) => {
      if (Array.isArray(week.days)) {
        week.days.forEach((d: any, idx: number) => {
          const baseDay = d.day || d.name || d.date || `Day ${idx + 1}`
          const weekLabel = week.week || week.number || wIdx + 1
          const dayName = `Week ${weekLabel} · ${baseDay}`
          const list = d.exercises || d.items || d.workouts || []
          rows.push(
            ...toRowsFromFlatArray(
              list,
              dayName,
              d.phase,
              d.dynamic_warm_up || d.warmup || d.warm_up,
              d.cool_down || d.cooldown || d.cool,
              d.focus
            )
          )
        })
      }
    })
    return rows
  }
  return []
}

const defaultPlan: WorkoutRow[] = [
  { id: 'd1-1', day: 'Day 1', exercise: 'Push-ups', sets: 3, reps: '12', restSeconds: 60 },
  { id: 'd1-2', day: 'Day 1', exercise: 'Bodyweight Squats', sets: 3, reps: '15', restSeconds: 60 },
  { id: 'd1-3', day: 'Day 1', exercise: 'Plank', sets: 3, reps: '45s', restSeconds: 60 },
  { id: 'd2-1', day: 'Day 2', exercise: 'Pull-ups / Rows', sets: 3, reps: '8', restSeconds: 90 },
  { id: 'd2-2', day: 'Day 2', exercise: 'Lunges', sets: 3, reps: '10/leg', restSeconds: 75 },
  { id: 'd2-3', day: 'Day 2', exercise: 'Hollow Hold', sets: 3, reps: '30s', restSeconds: 60 },
]

const WorkoutTracker: React.FC = () => {
  const [plan, setPlan] = useState<WorkoutRow[]>([])
  const [selectedDay, setSelectedDay] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [planError, setPlanError] = useState<string>('')
  const [progress, setProgress] = useState<Record<string, ProgressEntry>>({})
  const [now, setNow] = useState<number>(Date.now())
  const [session, setSession] = useState<SessionState | null>(null)
  const [phaseOrder, setPhaseOrder] = useState<string[]>([])
  const [isWarmExpanded, setIsWarmExpanded] = useState<boolean>(false)
  const [isCoolExpanded, setIsCoolExpanded] = useState<boolean>(false)
  const [beepedTimers, setBeepedTimers] = useState<Record<string, boolean>>({})
  const wakeLockRef = React.useRef<any>(null)

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    try {
      const isSmall = typeof window !== 'undefined' ? window.innerWidth < 768 : true
      setIsWarmExpanded(!isSmall)
      setIsCoolExpanded(!isSmall)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setProgress(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // ignore
    }
  }, [progress])

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true)
      setPlanError('')
      try {
        const res = await fetch('/two_month_workout_plan.json', { cache: 'no-store' })
        if (!res.ok) throw new Error('not found')
        const data = await res.json()
        const rows = toWorkoutRowsFromJson(data)
        if (rows.length === 0) throw new Error('empty')
        setPlan(rows)
        setSelectedDay(rows[0].day)
      } catch (err) {
        setPlanError('Could not load JSON. Using sample plan. Place two_month_workout_plan.json in /public to load it here.')
        setPlan(defaultPlan)
        setSelectedDay('Day 1')
      } finally {
        setLoading(false)
      }
    }
    fetchPlan()
  }, [])

  // Load session after plan days are known
  useEffect(() => {
    if (plan.length === 0) return
    // Derive stable day order and phase order
    const seenDays = new Set<string>()
    const dayOrder: string[] = []
    const phases: string[] = []
    const seenPhases = new Set<string>()
    for (const row of plan) {
      if (!seenDays.has(row.day)) {
        dayOrder.push(row.day)
        seenDays.add(row.day)
      }
      const ph = row.phase || 'Unspecified'
      if (!seenPhases.has(ph)) {
        phases.push(ph)
        seenPhases.add(ph)
      }
    }
    setPhaseOrder(phases)
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (raw) {
        const parsed: SessionState = JSON.parse(raw)
        // ensure day exists
        const dayNames = dayOrder
        const day = dayNames.includes(parsed.currentDayName) ? parsed.currentDayName : dayNames[0]
        setSession({ ...parsed, currentDayName: day })
        setSelectedDay(day)
      } else {
        // no session, auto-start first day
        const firstDay = dayOrder[0]
        setSelectedDay(firstDay)
        const next: SessionState = { currentDayName: firstDay, accumulatedMs: 0, lastResumeAtMs: Date.now(), isPaused: false }
        saveSession(next)
        requestWakeLock()
      }
    } catch {
      const firstDay = dayOrder[0]
      setSelectedDay(firstDay)
      const next: SessionState = { currentDayName: firstDay, accumulatedMs: 0, lastResumeAtMs: Date.now(), isPaused: false }
      saveSession(next)
      requestWakeLock()
    }
  }, [plan])

  const days = useMemo(() => {
    const order: string[] = []
    const seen = new Set<string>()
    for (const row of plan) {
      if (!seen.has(row.day)) {
        order.push(row.day)
        seen.add(row.day)
      }
    }
    return order
  }, [plan])
  const dayPhaseMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const row of plan) {
      if (!map[row.day]) map[row.day] = row.phase || 'Unspecified'
    }
    return map
  }, [plan])
  const phaseToDays = useMemo(() => {
    const m: Record<string, string[]> = {}
    for (const d of days) {
      const ph = dayPhaseMap[d] || 'Unspecified'
      if (!m[ph]) m[ph] = []
      m[ph].push(d)
    }
    return m
  }, [days, dayPhaseMap])
  const filtered = useMemo(() => plan.filter((p) => (selectedDay ? p.day === selectedDay : true)), [plan, selectedDay])

  const totalSets = filtered.reduce((acc, r) => acc + r.sets, 0)
  const completedSets = filtered.reduce((acc, r) => acc + Math.min(progress[r.id]?.setsCompleted ?? 0, r.sets), 0)
  const progressPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0
  const exercisesDoneCount = useMemo(() => filtered.filter((r) => (progress[r.id]?.setsCompleted ?? 0) >= r.sets).length, [filtered, progress])
  const setsRemaining = Math.max(0, totalSets - completedSets)

  const scrollToExercise = (rowId: string) => {
    try {
      const el = document.getElementById(`ex-${rowId}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch {}
  }

  const nextRow = useMemo(() => {
    for (const r of filtered) {
      const doneSets = progress[r.id]?.setsCompleted ?? 0
      if (doneSets < r.sets) return r
    }
    return null
  }, [filtered, progress])

  const saveSession = (next: SessionState | null) => {
    setSession(next)
    try {
      if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next))
      else localStorage.removeItem(SESSION_KEY)
    } catch {}
  }

  const requestWakeLock = async () => {
    try {
      // @ts-ignore
      if ('wakeLock' in navigator && !wakeLockRef.current) {
        // @ts-ignore
        wakeLockRef.current = await navigator.wakeLock.request('screen')
        wakeLockRef.current.addEventListener?.('release', () => {
          wakeLockRef.current = null
        })
      }
    } catch {}
  }

  const releaseWakeLock = async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release?.()
        wakeLockRef.current = null
      }
    } catch {}
  }

  // removed handleStartPlan (auto-start on mount)

  const handleTogglePause = () => {
    if (!session) return
    if (session.isPaused) {
      // resume
      saveSession({ ...session, isPaused: false, lastResumeAtMs: Date.now() })
      requestWakeLock()
      return
    }
    // pause
    const acc = session.accumulatedMs + (session.lastResumeAtMs ? Date.now() - session.lastResumeAtMs : 0)
    saveSession({ ...session, isPaused: true, accumulatedMs: acc, lastResumeAtMs: undefined })
    releaseWakeLock()
  }

  const getSessionElapsedMs = (): number => {
    if (!session) return 0
    const running = !session.isPaused && session.lastResumeAtMs ? Date.now() - session.lastResumeAtMs : 0
    return session.accumulatedMs + running
  }

  const handleFinishSession = () => {
    if (!session) return
    const durationMs = getSessionElapsedMs()
    const logEntry = {
      day: session.currentDayName,
      startedAt: session.lastResumeAtMs || Date.now(),
      durationMs,
      completedSets: { total: completedSets, outOf: totalSets },
      finishedAt: Date.now(),
    }
    try {
      const raw = localStorage.getItem(SESSIONS_LOG_KEY)
      const arr = raw ? JSON.parse(raw) : []
      arr.push(logEntry)
      localStorage.setItem(SESSIONS_LOG_KEY, JSON.stringify(arr))
    } catch {}
    saveSession(null)
    releaseWakeLock()
  }

  const handleNextDay = () => {
    if (days.length === 0) return
    const currentPhase = dayPhaseMap[selectedDay] || 'Unspecified'
    const daysInPhase = phaseToDays[currentPhase] || []
    const currentIndex = Math.max(0, daysInPhase.indexOf(selectedDay))
    if (currentIndex < 0) return
    const atEnd = currentIndex >= daysInPhase.length - 1
    if (atEnd) return
    const dayName = daysInPhase[currentIndex + 1]
    setSelectedDay(dayName)
    const next: SessionState = { currentDayName: dayName, accumulatedMs: 0, lastResumeAtMs: Date.now(), isPaused: false }
    saveSession(next)
    requestWakeLock()
  }

  const handleResetPlan = () => {
    if (!confirm('Reset all workout progress and session?')) return
    setProgress({})
    saveSession(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
    if (days.length > 0) setSelectedDay(days[0])
    releaseWakeLock()
  }

  const isDayComplete = useCallback((dayName: string): boolean => {
    const rows = plan.filter((r) => r.day === dayName)
    if (rows.length === 0) return false
    return rows.every((r) => (progress[r.id]?.setsCompleted ?? 0) >= r.sets)
  }, [plan, progress])

  const isPhaseComplete = useCallback((phaseName: string): boolean => {
    const list = phaseToDays[phaseName] || []
    if (list.length === 0) return false
    return list.every((d) => isDayComplete(d))
  }, [isDayComplete, phaseToDays])

  const currentPhaseName = useMemo(() => {
    for (const ph of phaseOrder) {
      if (!isPhaseComplete(ph)) return ph
    }
    return phaseOrder[phaseOrder.length - 1] || 'Unspecified'
  }, [phaseOrder, isPhaseComplete])

  const handleStartNextPhase = () => {
    const idx = Math.max(0, phaseOrder.indexOf(currentPhaseName))
    const nextIdx = idx + 1
    if (nextIdx >= phaseOrder.length) return
    const nextPhase = phaseOrder[nextIdx]
    const firstDay = (phaseToDays[nextPhase] || [])[0]
    if (!firstDay) return
    const next: SessionState = { currentDayName: firstDay, accumulatedMs: 0, lastResumeAtMs: Date.now(), isPaused: false }
    setSelectedDay(firstDay)
    saveSession(next)
  }

  const canSelectPhase = (_phaseName: string): boolean => {
    // All phases are selectable; no locking
    return true
  }

  const handleSelectPhase = (phaseName: string) => {
    if (!canSelectPhase(phaseName)) return
    const firstDay = (phaseToDays[phaseName] || [])[0]
    if (!firstDay) return
    setSelectedDay(firstDay)
    const next: SessionState = { currentDayName: firstDay, accumulatedMs: 0, lastResumeAtMs: Date.now(), isPaused: false }
    saveSession(next)
  }

  // removed upload handler (personal use)

  const handleAdjustSet = (id: string, delta: number, max: number) => {
    setProgress((prev) => {
      const current = prev[id]?.setsCompleted ?? 0
      const next = Math.min(Math.max(current + delta, 0), max)
      return { ...prev, [id]: { ...prev[id], setsCompleted: next } }
    })
  }

  const handleCompleteSet = (row: WorkoutRow) => {
    // Increment sets completed only; do NOT auto-start rest timer
    handleAdjustSet(row.id, 1, row.sets)
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        ;(navigator as any).vibrate?.(30)
      }
    } catch {}
    // Scroll to next incomplete after state updates flush
    setTimeout(() => {
      const id = (() => {
        for (const r of filtered) {
          const done = progress[r.id]?.setsCompleted ?? 0
          if (done < r.sets) return r.id
        }
        return null
      })()
      if (id && id !== row.id) scrollToExercise(id)
    }, 160)
  }

  const getRemaining = (rowId: string): number => {
    const endRaw = localStorage.getItem(`${STORAGE_KEY}_timer_${rowId}`)
    if (!endRaw) return 0
    const remaining = Math.max(0, parseInt(endRaw, 10) - now)
    if (remaining === 0) localStorage.removeItem(`${STORAGE_KEY}_timer_${rowId}`)
    return remaining
  }

  const handleStartTimer = (row: WorkoutRow) => {
    const endAt = Date.now() + row.restSeconds * 1000
    localStorage.setItem(`${STORAGE_KEY}_timer_${row.id}`, String(endAt))
    setNow(Date.now())
  }

  const handleResetTimer = (rowId: string) => {
    localStorage.removeItem(`${STORAGE_KEY}_timer_${rowId}`)
    setNow(Date.now())
  }

  const handleNoteChange = (rowId: string, value: string) => {
    setProgress((prev) => ({ ...prev, [rowId]: { ...prev[rowId], notes: value, setsCompleted: prev[rowId]?.setsCompleted ?? 0 } }))
  }

  const formatMs = (ms: number): string => {
    const total = Math.ceil(ms / 1000)
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Audio cue for rest timer completion
  const playBeep = async () => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = 880
      o.connect(g)
      g.connect(ctx.destination)
      g.gain.setValueAtTime(0.0001, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01)
      o.start()
      setTimeout(() => {
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05)
        o.stop(ctx.currentTime + 0.06)
        ctx.close()
      }, 160)
    } catch {}
  }

  // Poll for expired timers to alert
  useEffect(() => {
    const rows = filtered
    rows.forEach((r) => {
      try {
        const endRaw = localStorage.getItem(`${STORAGE_KEY}_timer_${r.id}`)
        if (!endRaw) return
        const remaining = Math.max(0, parseInt(endRaw, 10) - now)
        if (remaining <= 0 && !beepedTimers[r.id]) {
          playBeep()
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            ;(navigator as any).vibrate?.([20, 30, 20])
          }
          setBeepedTimers((m) => ({ ...m, [r.id]: true }))
          localStorage.removeItem(`${STORAGE_KEY}_timer_${r.id}`)
        }
        if (remaining > 0 && beepedTimers[r.id]) {
          setBeepedTimers((m) => ({ ...m, [r.id]: false }))
        }
      } catch {}
    })
  }, [now, filtered, beepedTimers])

  const isDayDone = useMemo(() => filtered.length > 0 && filtered.every((r) => (progress[r.id]?.setsCompleted ?? 0) >= r.sets), [filtered, progress])

  const handleStartWarmup = () => {
    setIsWarmExpanded(true)
    try {
      const el = document.getElementById('warmup-section')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch {}
  }

  const handleStartWorkout = () => {
    setIsWarmExpanded(false)
    const nextId = (() => {
      for (const r of filtered) {
        const done = progress[r.id]?.setsCompleted ?? 0
        if (done < r.sets) return r.id
      }
      return null
    })()
    if (nextId) scrollToExercise(nextId)
  }

  const handleStartCooldown = () => {
    setIsCoolExpanded(true)
    try {
      const el = document.getElementById('cooldown-section')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch {}
  }

  return (
    <div className="container-custom pt-10 pb-24 md:pb-10">
      <div className="mb-4 md:mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Workout Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">Track sets, rest timers, and notes. Auto-advance to the next exercise.</p>
          {planError && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded mt-2" role="status">{planError}</p>}
        </div>
        {/* Personal use: removed upload CTA */}
      </div>

      {/* Phase selector - compact dropdown */}
      {phaseOrder.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="phase-select" className="text-xs text-gray-600">Phase</label>
          <select
            id="phase-select"
            value={dayPhaseMap[selectedDay] || 'Unspecified'}
            onChange={(e) => handleSelectPhase(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
            aria-label="Select phase"
          >
            {phaseOrder.map((ph) => (
              <option key={ph} value={ph}>{ph}</option>
            ))}
          </select>
        </div>
      )}

      {/* Session Controls */}
      {session ? (
        <div className="mb-6 rounded-xl border border-gray-100 bg-white/80 backdrop-blur p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm text-gray-600">Today</div>
            <div className="text-lg font-semibold text-gray-900">{session.currentDayName}</div>
            <div className="text-xs text-gray-500 mt-0.5">Phase: {dayPhaseMap[session.currentDayName] || 'Unspecified'}</div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-sm font-mono md:min-w-[72px] text-center" aria-live="polite">{(() => {
              const ms = getSessionElapsedMs()
              const m = Math.floor(ms / 60000)
              const s = Math.floor((ms % 60000) / 1000)
              return `${m}:${s.toString().padStart(2, '0')}`
            })()}</div>
            <button onClick={handleTogglePause} className="px-3 py-2 rounded-lg text-sm border border-gray-200 bg-white hover:bg-gray-50 active:scale-[0.98]" aria-label={session.isPaused ? 'Resume session' : 'Pause session'}>
              {session.isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={handleFinishSession} className="px-3 py-2 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]" aria-label="Finish session">
              Finish Session
            </button>
            {(() => {
              const ph = dayPhaseMap[selectedDay] || 'Unspecified'
              const atPhaseEnd = (() => {
                const list = phaseToDays[ph] || []
                const idx = list.indexOf(selectedDay)
                return idx >= list.length - 1
              })()
              const canShowNextDay = !atPhaseEnd
              const canStartNextPhase = atPhaseEnd && isPhaseComplete(ph) && phaseOrder.indexOf(ph) < phaseOrder.length - 1
              return (
                <>
                  {canShowNextDay && (
                    <button onClick={handleNextDay} className="px-3 py-2 rounded-lg text-sm border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 active:scale-[0.98]" aria-label="Next day">
                      Next Day
                    </button>
                  )}
                  {canStartNextPhase && (
                    <button onClick={handleStartNextPhase} className="px-3 py-2 rounded-lg text-sm border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 active:scale-[0.98]" aria-label="Start next phase">
                      Start Next Phase
                    </button>
                  )}
                </>
              )
            })()}
            <button onClick={handleResetPlan} className="px-3 py-2 rounded-lg text-sm border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 active:scale-[0.98]" aria-label="Reset plan">
              Reset
            </button>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="p-6 rounded-xl bg-white/70 backdrop-blur border border-gray-100 shadow-sm">Loading plan…</div>
      ) : (
        <>
          {/* Only the current day is visible; day tabs removed intentionally */}

          {/* Warm-up section for the day */}
          {selectedDay && (
            (() => {
              const dayRows = plan.filter((r) => r.day === selectedDay)
              const warm = dayRows.find((r) => r.warmupText)?.warmupText
              const focus = dayRows.find((r) => r.focus)?.focus
              return (
                <div className="mb-4 md:mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <button
                    onClick={() => setIsWarmExpanded((v) => !v)}
                    className="w-full flex items-center justify-between gap-3"
                    aria-expanded={isWarmExpanded ? 'true' : 'false'}
                    aria-controls="warmup-section"
                  >
                    <div>
                      <div className="text-sm font-semibold text-amber-800">Dynamic Warm-up</div>
                      {focus && <div className="text-xs text-amber-700 mt-0.5">Focus: {focus}</div>}
                    </div>
                    <span className={`text-amber-700 text-xs transition-transform ${isWarmExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {warm && isWarmExpanded && (
                    <p id="warmup-section" className="text-sm text-amber-800 mt-2 whitespace-pre-wrap">{warm}</p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <button onClick={handleStartWarmup} className="px-3 py-2 rounded-lg text-xs border border-amber-300 text-amber-800 bg-amber-100 active:scale-[0.98]">Start Warm-up</button>
                    <button onClick={handleStartWorkout} className="px-3 py-2 rounded-lg text-xs border border-green-300 text-green-800 bg-green-100 active:scale-[0.98]">Start Workout</button>
                  </div>
                </div>
              )
            })()
          )}

          <div className="mb-5 sticky top-16 z-20 md:static md:z-auto bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 rounded-xl md:bg-transparent md:backdrop-blur-0 p-3 md:p-0 border md:border-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progress: {completedSets}/{totalSets} sets</span>
              <span className="text-sm font-medium text-green-700">{progressPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: `${progressPct}%` }} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPct} role="progressbar" />
            </div>
            {nextRow && (
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="truncate text-xs text-gray-600">Next: <span className="font-medium text-gray-900">{nextRow.exercise}</span> • Sets {(progress[nextRow.id]?.setsCompleted ?? 0)}/{nextRow.sets}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollToExercise(nextRow.id)}
                    className="px-3 py-1.5 rounded-md text-xs border border-gray-200 bg-white active:scale-[0.98]"
                    aria-label="Jump to next exercise"
                  >
                    Jump
                  </button>
                  <button
                    onClick={() => handleAdjustSet(nextRow.id, 1, nextRow.sets)}
                    className="px-3 py-1.5 rounded-md text-xs bg-green-600 text-white active:scale-[0.98]"
                    aria-label="Quick complete set for next exercise"
                  >
                    +1 Set
                  </button>
                </div>
              </div>
            )}
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px] text-gray-600">
              <div><span className="font-semibold text-gray-900">{exercisesDoneCount}</span> done</div>
              <div><span className="font-semibold text-gray-900">{setsRemaining}</span> sets left</div>
              <div><span className="font-semibold text-gray-900">{filtered.length}</span> total</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {filtered.map((row) => {
              const entry = progress[row.id] || { setsCompleted: 0 }
              const remaining = getRemaining(row.id)
              const done = entry.setsCompleted >= row.sets
              return (
                <div id={`ex-${row.id}`} key={row.id} className={`rounded-xl border shadow-sm p-4 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 ${done ? 'border-green-200 ring-1 ring-green-100' : 'border-gray-100'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 leading-tight">{row.exercise}</h3>
                      <div className="text-sm text-gray-600 mt-0.5">{row.sets} sets × {row.reps} • Rest {row.restSeconds}s</div>
                      {row.link && (
                        <a href={row.link} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center text-xs text-blue-600 hover:underline" aria-label={`How to: ${row.exercise}`}>
                          How to guide ↗
                        </a>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${done ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>{done ? 'Done' : 'Active'}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2" role="group" aria-label="Sets counter">
                      <button
                        aria-label={`Decrease completed sets for ${row.exercise}`}
                        onClick={() => handleAdjustSet(row.id, -1, row.sets)}
                        className="w-10 h-10 md:w-8 md:h-8 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-[0.98]"
                        tabIndex={0}
                      >
                        −
                      </button>
                      <div className="min-w-[92px] md:min-w-[80px] text-center text-sm font-medium text-gray-800">
                        <span className="font-semibold text-gray-900">{entry.setsCompleted}</span> / {row.sets} sets
                      </div>
                      <button
                        aria-label={`Increase completed sets for ${row.exercise}`}
                        onClick={() => handleAdjustSet(row.id, 1, row.sets)}
                        className="w-10 h-10 md:w-8 md:h-8 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-[0.98]"
                        tabIndex={0}
                      >
                        +
                      </button>
                    </div>

                    <button
                      aria-label={`Complete one set of ${row.exercise}`}
                      onClick={() => handleCompleteSet(row)}
                      className="px-4 py-2 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] disabled:opacity-50"
                      disabled={entry.setsCompleted >= row.sets}
                    >
                      Complete set
                    </button>
                  </div>

                  <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/70 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm text-gray-700">Rest timer</div>
                      <div className="text-sm font-semibold text-gray-900" aria-live="polite">{remaining > 0 ? formatMs(remaining) : 'Ready'}</div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        aria-label="Start rest timer"
                        onClick={() => handleStartTimer(row)}
                        className="px-3 py-2 rounded-md text-xs bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.98]"
                      >
                        Start
                      </button>
                      <button
                        aria-label="Reset rest timer"
                        onClick={() => handleResetTimer(row.id)}
                        className="px-3 py-2 rounded-md text-xs bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.98]"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor={`note-${row.id}`} className="block text-xs text-gray-600 mb-1">Notes</label>
                    <textarea
                      id={`note-${row.id}`}
                      value={entry.notes ?? ''}
                      onChange={(e) => handleNoteChange(row.id, e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200"
                      placeholder="Form cues, adjustments, how it felt…"
                      rows={2}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Cool-down section for the day */}
          {selectedDay && (
            (() => {
              const dayRows = plan.filter((r) => r.day === selectedDay)
              const cool = dayRows.find((r) => r.cooldownText)?.cooldownText
              return (
                <div className="mt-4 md:mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <button
                    onClick={() => setIsCoolExpanded((v) => !v)}
                    className="w-full flex items-center justify-between gap-3"
                    aria-expanded={isCoolExpanded ? 'true' : 'false'}
                    aria-controls="cooldown-section"
                  >
                    <div className="text-sm font-semibold text-blue-800">Cool-down</div>
                    <span className={`text-blue-700 text-xs transition-transform ${isCoolExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {cool && isCoolExpanded && (
                    <p id="cooldown-section" className="text-sm text-blue-800 mt-2 whitespace-pre-wrap">{cool}</p>
                  )}
                  {isDayDone && (
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={handleStartCooldown} className="px-3 py-2 rounded-lg text-xs border border-blue-300 text-blue-800 bg-blue-100 active:scale-[0.98]">Start Cool-down</button>
                      <button onClick={handleNextDay} className="px-3 py-2 rounded-lg text-xs border border-green-300 text-green-800 bg-green-100 active:scale-[0.98]">Next Day</button>
                    </div>
                  )}
                </div>
              )
            })()
          )}
        </>
      )}
    </div>
  )
}

export default WorkoutTracker


