import { useState, useEffect } from 'react'
import { X, ChevronRight, Trophy, Clock, Check, Minus, Plus } from 'lucide-react'
import { getExercise, CATEGORIES } from '../data/exercises.js'
import { ExerciseIcon } from '../components/ExerciseIcon.jsx'

// ── Elapsed timer ─────────────────────────────────────────────────────────────

function useElapsed(startedAt) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const start = new Date(startedAt).getTime()
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startedAt])
  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = elapsed % 60
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`
}

// ── Progress Ring ─────────────────────────────────────────────────────────────

function ProgressRing({ pct, size = 56, stroke = 5, color = '#ff2d55' }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(0,0,0,0.06)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="progress-ring-circle"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize="13"
        fontWeight="700"
      >
        {pct}%
      </text>
    </svg>
  )
}

// ── Set Row (inline rep tracking) ─────────────────────────────────────────────

function SetRow({ set, setIndex, targetReps, onToggle, onUpdateReps, catColor }) {
  const [animating, setAnimating] = useState(false)

  function handleComplete() {
    if (!set.completed) {
      setAnimating(true)
      setTimeout(() => setAnimating(false), 300)
    }
    onToggle()
  }

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
      style={{
        backgroundColor: set.completed ? 'rgba(52,199,89,0.08)' : '#f2f2f7',
      }}
    >
      {/* Set label */}
      <span className="text-[13px] font-semibold text-text-secondary w-12">
        Set {setIndex + 1}
      </span>

      {/* Rep counter */}
      <div className="flex-1 flex items-center justify-center gap-3">
        <button
          onClick={() => onUpdateReps(Math.max(0, (set.reps || targetReps) - 1))}
          className="w-8 h-8 rounded-full bg-white card-shadow flex items-center justify-center press-effect"
        >
          <Minus size={14} className="text-text-secondary" />
        </button>
        <div className="text-center min-w-[60px]">
          <span className="text-[22px] font-bold text-text-primary">{set.reps || targetReps}</span>
          <span className="text-[12px] text-text-tertiary ml-1">/ {targetReps}</span>
        </div>
        <button
          onClick={() => onUpdateReps((set.reps || targetReps) + 1)}
          className="w-8 h-8 rounded-full bg-white card-shadow flex items-center justify-center press-effect"
        >
          <Plus size={14} className="text-text-secondary" />
        </button>
      </div>

      {/* Complete button */}
      <button
        onClick={handleComplete}
        className="w-10 h-10 rounded-full flex items-center justify-center press-effect transition-all"
        style={{
          backgroundColor: set.completed ? '#34c759' : 'white',
          boxShadow: set.completed ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
          transform: animating ? 'scale(1.2)' : 'scale(1)',
        }}
      >
        {set.completed ? (
          <Check size={18} color="white" strokeWidth={3} className="animate-check-pop" />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
        )}
      </button>
    </div>
  )
}

// ── Current Exercise Panel ────────────────────────────────────────────────────

function CurrentExercisePanel({ sessionEx, exerciseIndex, totalExercises, onToggleSet, onUpdateReps, onNext, isLast }) {
  const ex = getExercise(sessionEx.exerciseId)
  const cat = CATEGORIES[ex?.category] ?? CATEGORIES.chest
  const allDone = sessionEx.sets.every(s => s.completed)
  const doneSets = sessionEx.sets.filter(s => s.completed).length

  return (
    <div className="bg-card rounded-3xl card-shadow overflow-hidden animate-fade-in">
      {/* Exercise header */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-4">
        <ExerciseIcon exerciseId={sessionEx.exerciseId} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: cat.color }}
            >
              {cat.name}
            </span>
            <span className="text-[11px] text-text-tertiary font-medium">
              {exerciseIndex + 1} of {totalExercises}
            </span>
          </div>
          <h2 className="text-[20px] font-bold text-text-primary leading-tight">{ex?.name}</h2>
          <p className="text-[13px] text-text-secondary mt-1">
            {doneSets}/{sessionEx.sets.length} sets complete
            {sessionEx.targetReps ? ` · ${sessionEx.targetReps} reps target` : ''}
          </p>
        </div>
      </div>

      {/* Set progress bar */}
      <div className="px-5 pb-3">
        <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(doneSets / sessionEx.sets.length) * 100}%`,
              backgroundColor: allDone ? '#34c759' : cat.color,
            }}
          />
        </div>
      </div>

      {/* Set rows with rep tracking */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        {sessionEx.sets.map((s, si) => (
          <SetRow
            key={si}
            set={s}
            setIndex={si}
            targetReps={sessionEx.targetReps}
            catColor={cat.color}
            onToggle={() => onToggleSet(exerciseIndex, si)}
            onUpdateReps={(reps) => onUpdateReps(exerciseIndex, si, reps)}
          />
        ))}
      </div>

      {/* Next exercise button */}
      {allDone && !isLast && (
        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 py-4 border-t border-border-subtle font-semibold text-[14px] press-effect animate-fade-in"
          style={{ color: cat.color }}
        >
          Next Exercise
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  )
}

// ── Upcoming exercise chip ────────────────────────────────────────────────────

function UpcomingChip({ sessionEx, isFocused }) {
  const ex = getExercise(sessionEx.exerciseId)
  const cat = CATEGORIES[ex?.category] ?? CATEGORIES.chest
  const doneSets = sessionEx.sets.filter(s => s.completed).length
  const allDone = doneSets === sessionEx.sets.length
  const totalReps = sessionEx.sets.reduce((a, s) => a + (s.reps || 0), 0)

  return (
    <div
      className="flex items-center gap-3 bg-card rounded-2xl px-4 py-3 card-shadow transition-all"
      style={{
        opacity: allDone && !isFocused ? 0.5 : 1,
        border: isFocused ? `2px solid ${cat.color}` : '2px solid transparent',
      }}
    >
      <ExerciseIcon exerciseId={sessionEx.exerciseId} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-text-primary truncate">{ex?.name}</p>
        <p className="text-[12px] text-text-secondary">
          {doneSets}/{sessionEx.sets.length} sets
          {allDone && totalReps > 0 ? ` · ${totalReps} reps` : sessionEx.targetReps ? ` · ${sessionEx.targetReps} reps target` : ''}
        </p>
      </div>
      {allDone && (
        <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0">
          <Check size={14} color="white" strokeWidth={3} />
        </div>
      )}
    </div>
  )
}

// ── Completion screen ─────────────────────────────────────────────────────────

function CompletionScreen({ session, progress, elapsed, onFinish, onDiscard }) {
  const totalReps = session.exercises.reduce(
    (a, ex) => a + ex.sets.reduce((b, s) => b + (s.reps || 0), 0), 0
  )

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 text-center bg-surface animate-fade-in">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-bounce-in"
        style={{ backgroundColor: 'rgba(52,199,89,0.12)' }}
      >
        <Trophy size={40} className="text-success" />
      </div>

      <h2 className="text-[28px] font-bold text-text-primary mb-2">Workout Complete!</h2>
      <p className="text-text-secondary text-[15px] mb-8">{session.workoutName}</p>

      {/* Stats row */}
      <div className="flex gap-3 mb-10 w-full max-w-xs">
        <div className="flex-1 bg-card rounded-2xl px-4 py-4 card-shadow text-center">
          <p className="text-[24px] font-bold text-text-primary">{progress.done}</p>
          <p className="text-[11px] text-text-secondary mt-1 uppercase tracking-wide font-medium">Sets</p>
        </div>
        <div className="flex-1 bg-card rounded-2xl px-4 py-4 card-shadow text-center">
          <p className="text-[24px] font-bold text-text-primary">{totalReps}</p>
          <p className="text-[11px] text-text-secondary mt-1 uppercase tracking-wide font-medium">Reps</p>
        </div>
        <div className="flex-1 bg-card rounded-2xl px-4 py-4 card-shadow text-center">
          <p className="text-[24px] font-bold text-text-primary">{elapsed}</p>
          <p className="text-[11px] text-text-secondary mt-1 uppercase tracking-wide font-medium">Time</p>
        </div>
      </div>

      <button
        onClick={onFinish}
        className="w-full max-w-xs py-4 rounded-2xl font-semibold text-white text-[16px] press-effect"
        style={{ backgroundColor: '#34c759', boxShadow: '0 4px 14px rgba(52,199,89,0.3)' }}
      >
        Finish Session
      </button>
      <button
        onClick={onDiscard}
        className="text-[14px] text-text-tertiary py-3 mt-2 press-effect"
      >
        Discard session
      </button>
    </div>
  )
}

// ── Session page ──────────────────────────────────────────────────────────────

export function Session({ session, progress, currentExerciseIndex, isComplete, onToggleSet, onUpdateReps, onEndSession, onDiscardSession }) {
  const elapsed = useElapsed(session.startedAt)
  const [focusedIndex, setFocusedIndex] = useState(
    currentExerciseIndex >= 0 ? currentExerciseIndex : 0
  )

  useEffect(() => {
    if (currentExerciseIndex >= 0) {
      setFocusedIndex(currentExerciseIndex)
    }
  }, [currentExerciseIndex])

  function handleNextExercise() {
    const next = focusedIndex + 1
    if (next < session.exercises.length) {
      setFocusedIndex(next)
    }
  }

  if (isComplete) {
    return (
      <CompletionScreen
        session={session}
        progress={progress}
        elapsed={elapsed}
        onFinish={onEndSession}
        onDiscard={onDiscardSession}
      />
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 flex-shrink-0 safe-top bg-card card-shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-[18px] font-bold text-text-primary leading-tight truncate">{session.workoutName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Clock size={13} className="text-text-tertiary" />
              <span className="text-[13px] text-text-secondary font-medium">{elapsed}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ProgressRing pct={progress.pct} />
            <button
              onClick={onDiscardSession}
              className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center press-effect"
            >
              <X size={16} className="text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Progress summary */}
        <div className="flex items-center gap-4 text-[12px] text-text-secondary">
          <span>{progress.done}/{progress.total} sets</span>
          <span className="w-1 h-1 rounded-full bg-text-tertiary" />
          <span>{progress.totalReps} reps</span>
          <span className="w-1 h-1 rounded-full bg-text-tertiary" />
          <span>{session.exercises.length} exercises</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 scroll-area px-5 pt-4 pb-6 flex flex-col gap-4">
        {/* Current / focused exercise */}
        <CurrentExercisePanel
          sessionEx={session.exercises[focusedIndex]}
          exerciseIndex={focusedIndex}
          totalExercises={session.exercises.length}
          onToggleSet={onToggleSet}
          onUpdateReps={onUpdateReps}
          onNext={handleNextExercise}
          isLast={focusedIndex === session.exercises.length - 1}
        />

        {/* Exercise list overview */}
        {session.exercises.length > 1 && (
          <div>
            <p className="text-[12px] font-semibold text-text-tertiary uppercase tracking-widest mb-3 px-1">
              All Exercises
            </p>
            <div className="flex flex-col gap-2">
              {session.exercises.map((ex, i) => (
                <button
                  key={ex.workoutExerciseId}
                  onClick={() => setFocusedIndex(i)}
                  className="press-effect text-left"
                >
                  <UpcomingChip sessionEx={ex} isFocused={i === focusedIndex} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* End session early */}
        {progress.done > 0 && (
          <button
            onClick={onEndSession}
            className="w-full py-3.5 rounded-2xl border-2 border-border-subtle text-[14px] font-semibold text-text-secondary press-effect"
          >
            End Session Early
          </button>
        )}
      </div>
    </div>
  )
}
