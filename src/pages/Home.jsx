import { useState } from 'react'
import { Plus, Play, Pencil, Trash2, Zap, ChevronRight } from 'lucide-react'
import { CATEGORIES, getExercise } from '../data/exercises.js'
import { ExerciseIcon } from '../components/ExerciseIcon.jsx'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

function WorkoutCard({ workout, onStart, onEdit, onDelete, hasActiveSession }) {
  const [showConfirm, setShowConfirm] = useState(false)

  const cats = [...new Set(
    workout.exercises.map(e => getExercise(e.exerciseId)?.category).filter(Boolean)
  )]

  const totalSets = workout.exercises.reduce((a, e) => a + e.sets, 0)

  return (
    <div className="bg-card rounded-3xl card-shadow overflow-hidden animate-fade-in">
      <div className="px-5 pt-5 pb-4">
        {/* Category pills */}
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {cats.slice(0, 3).map(cat => (
            <span
              key={cat}
              className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: CATEGORIES[cat]?.bg,
                color: CATEGORIES[cat]?.color,
              }}
            >
              {CATEGORIES[cat]?.name}
            </span>
          ))}
        </div>

        <h2 className="text-[17px] font-bold text-text-primary leading-tight">{workout.name}</h2>

        <p className="text-[13px] text-text-secondary mt-1">
          {workout.exercises.length === 0
            ? 'No exercises yet'
            : `${workout.exercises.length} exercises · ${totalSets} sets`}
        </p>

        {/* Exercise preview */}
        {workout.exercises.length > 0 && (
          <div className="flex gap-2 mt-3">
            {workout.exercises.slice(0, 5).map(ex => (
              <ExerciseIcon key={ex.id} exerciseId={ex.exerciseId} size="sm" />
            ))}
            {workout.exercises.length > 5 && (
              <div className="w-9 h-9 rounded-xl bg-elevated flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] text-text-tertiary font-semibold">+{workout.exercises.length - 5}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action row */}
      <div className="px-4 pb-4 flex gap-2">
        {showConfirm ? (
          <div className="flex-1 flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-2.5 rounded-2xl text-[13px] font-semibold text-text-secondary bg-elevated press-effect"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(workout.id)}
              className="flex-1 py-2.5 rounded-2xl text-[13px] font-semibold text-white press-effect"
              style={{ backgroundColor: '#ff3b30' }}
            >
              Delete
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowConfirm(true)}
              className="w-10 h-10 rounded-2xl bg-elevated flex items-center justify-center press-effect"
            >
              <Trash2 size={16} className="text-text-tertiary" />
            </button>
            <button
              onClick={() => onEdit(workout.id)}
              className="w-10 h-10 rounded-2xl bg-elevated flex items-center justify-center press-effect"
            >
              <Pencil size={16} className="text-text-tertiary" />
            </button>
            <button
              onClick={() => !hasActiveSession && onStart(workout)}
              disabled={hasActiveSession}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-[14px] font-semibold press-effect transition-opacity disabled:opacity-40"
              style={{
                backgroundColor: '#ff2d55',
                color: 'white',
              }}
            >
              <Play size={14} fill="white" />
              Start Workout
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export function Home({ workouts, onStart, onEdit, onDeleteWorkout, onNewWorkout, session, onGoToSession }) {
  const hasActiveSession = !!session

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface">
      {/* Header */}
      <header className="px-5 pt-14 pb-2 flex-shrink-0 safe-top">
        <p className="text-[15px] text-text-secondary font-medium">{getGreeting()}</p>
        <h1 className="text-[32px] font-bold text-text-primary leading-tight tracking-tight mt-0.5">
          Time to Exercise!
        </h1>
      </header>

      {/* Active session banner */}
      {hasActiveSession && (
        <div className="px-5 pt-3 pb-1">
          <button
            onClick={onGoToSession}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl press-effect card-shadow"
            style={{ backgroundColor: '#ff2d55' }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[14px] font-semibold text-white">Session in progress</p>
              <p className="text-[12px] text-white/70 mt-0.5">{session.workoutName}</p>
            </div>
            <ChevronRight size={18} className="text-white/60" />
          </button>
        </div>
      )}

      {/* Workout list */}
      <div className="flex-1 scroll-area px-5 pt-4 pb-28">
        {workouts.length === 0 ? (
          <EmptyState onNew={onNewWorkout} />
        ) : (
          <div className="flex flex-col gap-4">
            {workouts.map(workout => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onStart={onStart}
                onEdit={onEdit}
                onDelete={onDeleteWorkout}
                hasActiveSession={hasActiveSession}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={onNewWorkout}
        className="absolute bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center press-effect z-10"
        style={{
          backgroundColor: '#ff2d55',
          boxShadow: '0 4px 14px rgba(255,45,85,0.4)',
        }}
      >
        <Plus size={26} color="white" strokeWidth={2.5} />
      </button>
    </div>
  )
}

function EmptyState({ onNew }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: 'rgba(255,45,85,0.1)' }}
      >
        <span className="text-4xl">🏋️</span>
      </div>
      <h3 className="text-[20px] font-bold text-text-primary mb-2">No workouts yet</h3>
      <p className="text-text-secondary text-[14px] mb-8 max-w-[240px] leading-relaxed">
        Create your first workout and start your fitness journey
      </p>
      <button
        onClick={onNew}
        className="flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white press-effect"
        style={{
          backgroundColor: '#ff2d55',
          boxShadow: '0 4px 14px rgba(255,45,85,0.3)',
        }}
      >
        <Plus size={18} />
        Create Workout
      </button>
    </div>
  )
}
