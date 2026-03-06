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
    updateSetReps,
    progress,
    currentExerciseIndex,
    isComplete,
  } = useSession()

  const [tab, setTab] = useState('home')
  const [builderState, setBuilderState] = useState(null)

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
      updateWorkout(builderState.workoutId, { name })
      saveExercises(builderState.workoutId, exercises)
    } else {
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

  // Builder overlay
  if (builderState !== null) {
    const existing = builderState.workoutId
      ? workouts.find(w => w.id === builderState.workoutId)
      : null

    return (
      <div className="flex flex-col h-full bg-surface">
        <Builder
          workout={existing}
          onSave={handleSaveWorkout}
          onCancel={closeBuilder}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-surface relative">
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
              onUpdateReps={updateSetReps}
              onEndSession={handleEndSession}
              onDiscardSession={handleDiscardSession}
            />
          ) : (
            <NoSession onGoHome={() => setTab('home')} />
          )
        )}

        {tab === 'history' && <History />}
      </div>

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
    <div className="flex-1 flex flex-col items-center justify-center px-5 text-center bg-surface">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: 'rgba(255,45,85,0.1)' }}
      >
        <span className="text-4xl">⚡</span>
      </div>
      <h2 className="text-[20px] font-bold text-text-primary mb-2">No active session</h2>
      <p className="text-text-secondary text-[14px] mb-8 max-w-[220px] leading-relaxed">
        Go to Workouts and tap Start to begin a workout
      </p>
      <button
        onClick={onGoHome}
        className="px-6 py-3.5 rounded-full font-semibold text-white press-effect"
        style={{ backgroundColor: '#ff2d55', boxShadow: '0 4px 14px rgba(255,45,85,0.3)' }}
      >
        Browse Workouts
      </button>
    </div>
  )
}
