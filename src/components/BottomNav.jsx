import { Dumbbell, Zap, Clock } from 'lucide-react'

const TABS = [
  { key: 'home',    label: 'Workouts', Icon: Dumbbell },
  { key: 'session', label: 'Session',  Icon: Zap       },
  { key: 'history', label: 'History',  Icon: Clock     },
]

export function BottomNav({ current, onNavigate, hasActiveSession }) {
  return (
    <nav className="flex-shrink-0 bg-surface border-t border-border-subtle safe-bottom">
      <div className="flex">
        {TABS.map(({ key, label, Icon }) => {
          const active = current === key
          const showBadge = key === 'session' && hasActiveSession

          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-1 relative press-effect"
            >
              <div className="relative">
                <Icon
                  size={22}
                  className="transition-colors"
                  style={{ color: active ? '#ef4444' : '#6b7280' }}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 block" />
                )}
              </div>
              <span
                className="text-[10px] font-medium tracking-wide transition-colors"
                style={{ color: active ? '#ef4444' : '#6b7280' }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
