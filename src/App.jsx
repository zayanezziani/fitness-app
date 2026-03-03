import { useState } from 'react'
import { BottomNav } from './components/BottomNav.jsx'
import { Home } from './pages/Home.jsx'
import { Builder } from './pages/Builder.jsx'
import { Session } from './pages/Session.jsx'
import { History } from './pages/History.jsx'
import { useWorkouts } from './hooks/useWorkouts.js'
import { useSession } from './hooks/useSession.js'
import { uid } from './utils/id.js'

export default function App() {
  const { workouts, createWorkout, updateWorkout, deleteWorkout, saveExercises } = useWorkouts()
  const {
    session,
    startSession,
    endSession,
    discardSession,
    completeSet,
    progress,
    currentExerciseIndex,
    isComplete,
  } = useSession()

  // Tab navigation
  const [tab, setTab] = useState('home')

  // Builder overlay state
  const [builderState, setBuilderState] = useState(null) // null | { workoutId: string | null }

  // ── Navigation helpers ──────────────────────────────────────────────────────

  function openNewWorkout() {
    setBuilderState({ workoutId: null })
  }

  function openEditWorkout(id) {
    setBuilderState({ workoutId: id })
  }

  function closeBuilder() {
    setBuilderState(null)
  }

  function handleSaveWorkout({ name, exercises }) {
    if (builderState?.workoutId) {
      // Editing existing
      updateWorkout(builderState.workoutId, { name })
      saveExercises(builderState.workoutId, exercises)
    } else {
      // Creating new
      const id = createWorkout(name)
      saveExercises(id, exercises)
    }
    setBuilderState(null)
  }

  function handleStartSession(workout) {
    startSession(workout)
    setTab('session')
  }

  function handleEndSession() {
    endSession()
    setTab('home')
  }

  function handleDiscardSession() {
    discardSession()
    setTab('home')
  }

  function handleDeleteWorkout(id) {
    deleteWorkout(id)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  // Builder overlay (slides over home tab)
  if (builderState !== null) {
    const existing = builderState.workoutId
      ? workouts.find(w => w.id === builderState.workoutId)
      : null

    return (
      <div className="flex flex-col h-full bg-[#0a0a0a]">
        <Builder
          workout={existing}
          onSave={handleSaveWorkout}
          onCancel={closeBuilder}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] relative">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {tab === 'home' && (
          <Home
            workouts={workouts}
            onStart={handleStartSession}
            onEdit={openEditWorkout}
            onDeleteWorkout={handleDeleteWorkout}
            onNewWorkout={openNewWorkout}
            session={session}
            onGoToSession={() => setTab('session')}
          />
        )}

        {tab === 'session' && (
          session ? (
            <Session
              session={session}
              progress={progress}
              currentExerciseIndex={currentExerciseIndex}
              isComplete={isComplete}
              onToggleSet={completeSet}
              onEndSession={handleEndSession}
              onDiscardSession={handleDiscardSession}
            />
          ) : (
            <NoSession onGoHome={() => setTab('home')} />
          )
        )}

        {tab === 'history' && <History />}
      </div>

      {/* Bottom nav */}
      <BottomNav
        current={tab}
        onNavigate={setTab}
        hasActiveSession={!!session}
      />
    </div>
  )
}

function NoSession({ onGoHome }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
        style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
      >
        <span className="text-4xl">⚡</span>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">No active session</h2>
      <p className="text-zinc-500 text-sm mb-8 max-w-[220px] leading-relaxed">
        Go to Workouts and tap Start on a workout day to begin
      </p>
      <button
        onClick={onGoHome}
        className="px-6 py-3 rounded-2xl font-bold text-white press-effect"
        style={{ backgroundColor: '#ef4444' }}
      >
        Browse Workouts
      </button>
    </div>
  )
}
