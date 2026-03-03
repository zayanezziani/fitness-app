import { useState, useEffect, useRef } from 'react'
import { X, CheckCircle2, ChevronRight, Trophy, RotateCcw, Clock } from 'lucide-react'
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

// ── Set button ────────────────────────────────────────────────────────────────

function SetButton({ setIndex, completed, onToggle, catColor }) {
  const [animating, setAnimating] = useState(false)

  function handlePress() {
    if (!completed) {
      setAnimating(true)
      setTimeout(() => setAnimating(false), 300)
    }
    onToggle()
  }

  return (
    <button
      onClick={handlePress}
      className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all press-effect"
      style={
        completed
          ? { backgroundColor: 'rgba(34,197,94,0.15)', borderColor: '#22c55e', transform: animating ? 'scale(0.92)' : 'scale(1)' }
          : { backgroundColor: '#1c1c1c', borderColor: '#2a2a2a' }
      }
    >
      <span
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: completed ? '#22c55e' : '#6b7280' }}
      >
        Set {setIndex + 1}
      </span>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
        style={
          completed
            ? { backgroundColor: '#22c55e' }
            : { backgroundColor: '#252525', border: '2px solid #3a3a3a' }
        }
      >
        {completed && (
          <svg viewBox="0 0 14 14" width="16" height="16" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2,7 5.5,10.5 12,3.5" />
          </svg>
        )}
      </div>
    </button>
  )
}

// ── Exercise panel (current exercise) ────────────────────────────────────────

function CurrentExercisePanel({ sessionEx, exerciseIndex, totalExercises, onToggleSet, onNext, isLast }) {
  const ex = getExercise(sessionEx.exerciseId)
  const cat = CATEGORIES[ex?.category] ?? CATEGORIES.chest
  const allDone = sessionEx.sets.every(s => s.completed)
  const doneSets = sessionEx.sets.filter(s => s.completed).length

  return (
    <div className="bg-card rounded-3xl border border-border-subtle overflow-hidden animate-fade-in">
      {/* Exercise header */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-4">
        <ExerciseIcon exerciseId={sessionEx.exerciseId} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: cat.color }}
            >
              {cat.name}
            </span>
            <span className="text-xs text-zinc-600">
              {exerciseIndex + 1}/{totalExercises}
            </span>
          </div>
          <h2 className="text-xl font-black text-white leading-tight">{ex?.name}</h2>
          <p className="text-sm text-zinc-500 mt-1">
            {sessionEx.sets.length} sets × {sessionEx.sets[0] ? (
              // reps come from workout config — we don't store per-set reps in session,
              // but we can infer from the count. Show set count anyway.
              `${doneSets}/${sessionEx.sets.length} done`
            ) : null}
          </p>
        </div>
      </div>

      {/* Set progress bar */}
      <div className="px-5 pb-4">
        <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(doneSets / sessionEx.sets.length) * 100}%`,
              backgroundColor: allDone ? '#22c55e' : cat.color,
            }}
          />
        </div>
      </div>

      {/* Set buttons */}
      <div className="px-4 pb-4 flex gap-3">
        {sessionEx.sets.map((s, si) => (
          <SetButton
            key={si}
            setIndex={si}
            completed={s.completed}
            catColor={cat.color}
            onToggle={() => onToggleSet(exerciseIndex, si)}
          />
        ))}
      </div>

      {/* Next exercise button */}
      {allDone && !isLast && (
        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 py-4 border-t border-border-subtle font-bold text-sm press-effect animate-fade-in"
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

function UpcomingChip({ sessionEx, index }) {
  const ex = getExercise(sessionEx.exerciseId)
  const doneSets = sessionEx.sets.filter(s => s.completed).length
  const allDone = doneSets === sessionEx.sets.length

  return (
    <div
      className="flex items-center gap-3 bg-card rounded-2xl px-3 py-2.5 border border-border-subtle"
      style={allDone ? { opacity: 0.4 } : {}}
    >
      <ExerciseIcon exerciseId={sessionEx.exerciseId} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{ex?.name}</p>
        <p className="text-xs text-zinc-600">{sessionEx.sets.length} sets</p>
      </div>
      {allDone && (
        <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
      )}
    </div>
  )
}

// ── Completion screen ─────────────────────────────────────────────────────────

function CompletionScreen({ session, progress, elapsed, onFinish, onDiscard }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 text-center animate-fade-in">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-bounce-in"
        style={{ backgroundColor: 'rgba(34,197,94,0.15)', border: '2px solid #22c55e' }}
      >
        <Trophy size={40} className="text-green-500" />
      </div>

      <h2 className="text-3xl font-black text-white mb-2">Crushed it! 💪</h2>
      <p className="text-zinc-400 text-sm mb-8">{session.workoutName}</p>

      {/* Stats */}
      <div className="flex gap-4 mb-10">
        <div className="bg-card rounded-2xl px-6 py-4 border border-border-subtle">
          <p className="text-2xl font-black text-white">{progress.done}</p>
          <p className="text-xs text-zinc-500 mt-1">Sets done</p>
        </div>
        <div className="bg-card rounded-2xl px-6 py-4 border border-border-subtle">
          <p className="text-2xl font-black text-white">{elapsed}</p>
          <p className="text-xs text-zinc-500 mt-1">Duration</p>
        </div>
        <div className="bg-card rounded-2xl px-6 py-4 border border-border-subtle">
          <p className="text-2xl font-black text-white">{session.exercises.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Exercises</p>
        </div>
      </div>

      <button
        onClick={onFinish}
        className="w-full py-4 rounded-2xl font-bold text-white text-base mb-3 press-effect"
        style={{ backgroundColor: '#22c55e' }}
      >
        Finish Session
      </button>
      <button
        onClick={onDiscard}
        className="text-sm text-zinc-500 py-2 press-effect"
      >
        Discard session
      </button>
    </div>
  )
}

// ── Session page ──────────────────────────────────────────────────────────────

export function Session({ session, progress, currentExerciseIndex, isComplete, onToggleSet, onEndSession, onDiscardSession }) {
  const elapsed = useElapsed(session.startedAt)
  const [focusedIndex, setFocusedIndex] = useState(
    currentExerciseIndex >= 0 ? currentExerciseIndex : 0
  )

  // Auto-advance focus to next incomplete exercise
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

  const pct = progress.pct

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-5 pt-5 pb-4 flex-shrink-0 safe-top">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-black text-white leading-tight">{session.workoutName}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Clock size={12} className="text-zinc-500" />
              <span className="text-xs text-zinc-500">{elapsed}</span>
            </div>
          </div>
          <button
            onClick={onDiscardSession}
            className="p-2 press-effect"
          >
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        {/* Overall progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, backgroundColor: '#ef4444' }}
            />
          </div>
          <span className="text-xs font-bold text-zinc-400 w-12 text-right">
            {progress.done}/{progress.total}
          </span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 scroll-area px-5 pb-6 flex flex-col gap-5">
        {/* Current / focused exercise */}
        <CurrentExercisePanel
          sessionEx={session.exercises[focusedIndex]}
          exerciseIndex={focusedIndex}
          totalExercises={session.exercises.length}
          onToggleSet={onToggleSet}
          onNext={handleNextExercise}
          isLast={focusedIndex === session.exercises.length - 1}
        />

        {/* Exercise list overview */}
        <div>
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-3">All Exercises</p>
          <div className="flex flex-col gap-2">
            {session.exercises.map((ex, i) => (
              <button
                key={ex.workoutExerciseId}
                onClick={() => setFocusedIndex(i)}
                className="press-effect text-left"
              >
                <div style={{
                  outline: i === focusedIndex ? '2px solid rgba(239,68,68,0.5)' : 'none',
                  borderRadius: '1rem',
                }}>
                  <UpcomingChip sessionEx={ex} index={i} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Finish session early */}
        {progress.done > 0 && (
          <button
            onClick={onEndSession}
            className="w-full py-4 rounded-2xl border border-border-subtle text-sm font-bold text-zinc-400 press-effect"
          >
            End Session
          </button>
        )}
      </div>
    </div>
  )
}
