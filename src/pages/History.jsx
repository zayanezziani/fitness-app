import { useState, useEffect } from 'react'
import { Trophy, Calendar, Clock, ChevronDown, Check } from 'lucide-react'
import { storage } from '../utils/storage.js'
import { getExercise, CATEGORIES } from '../data/exercises.js'
import { ExerciseIcon } from '../components/ExerciseIcon.jsx'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatDuration(startedAt, completedAt) {
  const ms = new Date(completedAt) - new Date(startedAt)
  const m = Math.floor(ms / 60000)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h ${m % 60}m`
  return `${m}m`
}

function SessionCard({ session }) {
  const [expanded, setExpanded] = useState(false)
  const totalSets = session.exercises.reduce((a, e) => a + e.sets.length, 0)
  const doneSets  = session.exercises.reduce((a, e) => a + e.sets.filter(s => s.completed).length, 0)
  const totalReps = session.exercises.reduce(
    (a, ex) => a + ex.sets.reduce((b, s) => b + (s.reps || 0), 0), 0
  )

  return (
    <div className="bg-card rounded-2xl card-shadow overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-start gap-4 px-4 py-4 press-effect"
      >
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(255,45,85,0.1)' }}
        >
          <Trophy size={20} className="text-accent" />
        </div>
        <div className="flex-1 text-left">
          <p className="font-bold text-text-primary text-[15px]">{session.workoutName}</p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-[12px] text-text-secondary flex items-center gap-1">
              <Calendar size={11} />
              {formatDate(session.startedAt)}
            </span>
            {session.completedAt && (
              <span className="text-[12px] text-text-secondary flex items-center gap-1">
                <Clock size={11} />
                {formatDuration(session.startedAt, session.completedAt)}
              </span>
            )}
            <span className="text-[12px] text-text-secondary">{doneSets}/{totalSets} sets</span>
            {totalReps > 0 && (
              <span className="text-[12px] text-text-secondary">{totalReps} reps</span>
            )}
          </div>
        </div>
        <ChevronDown
          size={18}
          className="text-text-tertiary flex-shrink-0 transition-transform mt-1"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {expanded && (
        <div className="border-t border-border-subtle px-4 py-3 flex flex-col gap-2.5 animate-fade-in">
          {session.exercises.map((ex, i) => {
            const exercise = getExercise(ex.exerciseId)
            const done = ex.sets.filter(s => s.completed).length
            const reps = ex.sets.reduce((a, s) => a + (s.reps || 0), 0)
            const allDone = done === ex.sets.length

            return (
              <div key={i} className="flex items-center gap-3">
                <ExerciseIcon exerciseId={ex.exerciseId} size="sm" />
                <div className="flex-1">
                  <p className="text-[13px] text-text-primary font-medium">{exercise?.name}</p>
                  <p className="text-[11px] text-text-secondary">
                    {done}/{ex.sets.length} sets{reps > 0 ? ` · ${reps} reps` : ''}
                  </p>
                </div>
                {allDone && (
                  <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                    <Check size={12} color="white" strokeWidth={3} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function History() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(storage.getHistory())
  }, [])

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface">
      <header className="px-5 pt-8 pb-4 flex-shrink-0 safe-top">
        <h1 className="text-[32px] font-bold text-text-primary tracking-tight">History</h1>
        <p className="text-[14px] text-text-secondary mt-0.5">
          {history.length === 0 ? 'No sessions yet' : `${history.length} session${history.length !== 1 ? 's' : ''} completed`}
        </p>
      </header>

      <div className="flex-1 scroll-area px-5 pb-6">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
              style={{ backgroundColor: 'rgba(255,45,85,0.1)' }}
            >
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-[20px] font-bold text-text-primary mb-2">No history yet</h3>
            <p className="text-text-secondary text-[14px] max-w-[240px] leading-relaxed">
              Complete a workout session and it'll show up here
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map(s => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
