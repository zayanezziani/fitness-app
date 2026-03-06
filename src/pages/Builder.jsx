import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Plus, Minus, Trash2, Search, X, Check } from 'lucide-react'
import { EXERCISES, CATEGORIES, getExercise, getExercisesByCategory } from '../data/exercises.js'
import { ExerciseIcon } from '../components/ExerciseIcon.jsx'
import { uid } from '../utils/id.js'

// ── Exercise Picker Sheet ────────────────────────────────────────────────────

function ExercisePicker({ addedIds, onAdd, onClose }) {
  const [query, setQuery] = useState('')
  const grouped = getExercisesByCategory()

  const filtered = query.trim()
    ? EXERCISES.filter(e => e.name.toLowerCase().includes(query.toLowerCase()))
    : null

  const list = filtered
    ? [{ key: 'results', exercises: filtered }]
    : Object.entries(grouped).map(([key, exercises]) => ({ key, exercises }))

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
    >
      <div className="flex-1" onClick={onClose} />

      <div
        className="bg-white rounded-t-3xl flex flex-col animate-slide-up"
        style={{ maxHeight: '80vh' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-text-primary">Add Exercise</h2>
          <button onClick={onClose} className="p-1 press-effect">
            <X size={22} className="text-text-tertiary" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 mb-3">
          <div className="flex items-center gap-3 bg-elevated px-4 py-3 rounded-xl">
            <Search size={16} className="text-text-tertiary flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search exercises..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-text-primary text-[15px] placeholder-text-tertiary leading-none"
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X size={14} className="text-text-tertiary" />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto scroll-area pb-8">
          {list.map(({ key, exercises }) => (
            <div key={key}>
              {!filtered && (
                <div className="px-5 py-2 flex items-center gap-2">
                  <span
                    className="text-[11px] font-bold tracking-widest uppercase"
                    style={{ color: CATEGORIES[key]?.color ?? '#ff2d55' }}
                  >
                    {CATEGORIES[key]?.name ?? key}
                  </span>
                </div>
              )}
              {exercises.map(ex => {
                const added = addedIds.has(ex.id)
                return (
                  <button
                    key={ex.id}
                    onClick={() => !added && onAdd(ex)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 press-effect"
                    style={{ opacity: added ? 0.4 : 1 }}
                  >
                    <ExerciseIcon exerciseId={ex.id} size="sm" />
                    <span className="flex-1 text-left text-[14px] font-medium text-text-primary">
                      {ex.name}
                    </span>
                    {added ? (
                      <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                        <Check size={14} color="white" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-elevated flex items-center justify-center">
                        <Plus size={14} className="text-text-secondary" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
          {filtered && filtered.length === 0 && (
            <p className="text-center text-text-tertiary py-10 text-[14px]">No results for "{query}"</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Stepper control ──────────────────────────────────────────────────────────

function Stepper({ label, value, onChange, min = 1, max = 99 }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[12px] text-text-secondary font-medium w-8 text-right">{label}</span>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center press-effect"
      >
        <Minus size={14} className="text-text-secondary" />
      </button>
      <span className="w-8 text-center text-[15px] font-bold text-text-primary">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center press-effect"
      >
        <Plus size={14} className="text-text-secondary" />
      </button>
    </div>
  )
}

// ── Exercise row in builder ──────────────────────────────────────────────────

function ExerciseRow({ item, index, total, onUpdate, onDelete, onMoveUp, onMoveDown }) {
  const ex = getExercise(item.exerciseId)
  const cat = CATEGORIES[ex?.category]

  return (
    <div className="bg-card rounded-2xl card-shadow overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3.5">
        <ExerciseIcon exerciseId={item.exerciseId} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-text-primary truncate">{ex?.name ?? 'Unknown'}</p>
          <p className="text-[12px] text-text-secondary mt-0.5">
            {cat?.name ?? ''}
          </p>
        </div>
        {/* Reorder */}
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            className="p-1 press-effect disabled:opacity-20"
          >
            <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="#8e8e93">
              <polyline points="2,9 7,4 12,9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={() => onMoveDown(index)}
            disabled={index === total - 1}
            className="p-1 press-effect disabled:opacity-20"
          >
            <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="#8e8e93">
              <polyline points="2,5 7,10 12,5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <button
          onClick={() => onDelete(index)}
          className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center press-effect"
        >
          <Trash2 size={14} className="text-text-tertiary" />
        </button>
      </div>

      {/* Sets / Reps */}
      <div className="flex items-center gap-5 px-4 pb-3.5 pt-1 border-t border-border-subtle">
        <Stepper
          label="Sets"
          value={item.sets}
          onChange={v => onUpdate(index, { sets: v })}
        />
        <div className="w-px h-6 bg-border-subtle" />
        <Stepper
          label="Reps"
          value={item.reps}
          onChange={v => onUpdate(index, { reps: v })}
          max={200}
        />
      </div>
    </div>
  )
}

// ── Builder page ─────────────────────────────────────────────────────────────

export function Builder({ workout, onSave, onCancel }) {
  const isNew = !workout
  const [name, setName] = useState(workout?.name ?? '')
  const [exercises, setExercises] = useState(workout?.exercises ?? [])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [nameFocused, setNameFocused] = useState(false)
  const nameRef = useRef(null)

  useEffect(() => {
    if (isNew && nameRef.current) nameRef.current.focus()
  }, [isNew])

  const addedIds = new Set(exercises.map(e => e.exerciseId))

  function handleAddExercise(ex) {
    setExercises(prev => [...prev, {
      id: uid(),
      exerciseId: ex.id,
      sets: ex.defaultSets,
      reps: ex.defaultReps,
    }])
  }

  function handleUpdate(index, patch) {
    setExercises(prev => prev.map((e, i) => i === index ? { ...e, ...patch } : e))
  }

  function handleDelete(index) {
    setExercises(prev => prev.filter((_, i) => i !== index))
  }

  function handleMoveUp(index) {
    if (index === 0) return
    setExercises(prev => {
      const arr = [...prev]
      ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
      return arr
    })
  }

  function handleMoveDown(index) {
    setExercises(prev => {
      if (index === prev.length - 1) return prev
      const arr = [...prev]
      ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
      return arr
    })
  }

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) {
      nameRef.current?.focus()
      return
    }
    onSave({ name: trimmed, exercises })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 flex-shrink-0 safe-top bg-card card-shadow">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onCancel} className="press-effect -ml-1 p-1">
            <ArrowLeft size={22} className="text-text-secondary" />
          </button>
          <span className="text-[15px] font-medium text-text-secondary">{isNew ? 'New Workout' : 'Edit Workout'}</span>
        </div>

        {/* Workout name input */}
        <div
          className="px-4 py-3.5 rounded-2xl transition-all"
          style={{
            backgroundColor: '#f2f2f7',
            border: nameFocused ? '2px solid #ff2d55' : '2px solid transparent',
          }}
        >
          <input
            ref={nameRef}
            type="text"
            placeholder="Workout name (e.g. Back Day)"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            className="w-full bg-transparent text-text-primary text-[20px] font-bold placeholder-text-tertiary leading-none"
            maxLength={40}
          />
        </div>
      </header>

      {/* Exercise list */}
      <div className="flex-1 scroll-area px-5 pt-4">
        {exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(255,45,85,0.1)' }}
            >
              <span className="text-3xl">🏋️</span>
            </div>
            <p className="text-text-secondary text-[14px]">Add exercises to your workout</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-6">
            {exercises.map((item, i) => (
              <ExerciseRow
                key={item.id}
                item={item}
                index={i}
                total={exercises.length}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="flex-shrink-0 px-5 pb-6 pt-3 flex flex-col gap-3 bg-surface safe-bottom">
        <button
          onClick={() => setPickerOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-gray-300 text-[14px] font-semibold text-text-secondary press-effect"
        >
          <Plus size={18} />
          Add Exercise
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full py-4 rounded-2xl font-semibold text-[16px] text-white press-effect disabled:opacity-40 transition-opacity"
          style={{ backgroundColor: '#ff2d55', boxShadow: '0 4px 14px rgba(255,45,85,0.3)' }}
        >
          {isNew ? 'Create Workout' : 'Save Changes'}
        </button>
      </div>

      {pickerOpen && (
        <ExercisePicker
          addedIds={addedIds}
          onAdd={ex => { handleAddExercise(ex) }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}
