const KEYS = {
  workouts: 'gymlog_workouts',
  session:  'gymlog_session',
  history:  'gymlog_history',
}

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full — silently fail
  }
}

export const storage = {
  getWorkouts:  () => read(KEYS.workouts) ?? [],
  saveWorkouts: (v) => write(KEYS.workouts, v),

  getSession:   () => read(KEYS.session),
  saveSession:  (v) => write(KEYS.session, v),
  clearSession: () => localStorage.removeItem(KEYS.session),

  getHistory:   () => read(KEYS.history) ?? [],
  saveHistory:  (v) => write(KEYS.history, v),
}
