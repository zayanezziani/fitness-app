import { Dumbbell, Zap, Clock } from 'lucide-react'

const TABS = [
  { key: 'home',    label: 'Workouts', Icon: Dumbbell },
  { key: 'session', label: 'Session',  Icon: Zap       },
  { key: 'history', label: 'History',  Icon: Clock     },
]

export function BottomNav({ current, onNavigate, hasActiveSession }) {
  return (
    <nav className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-t border-border-subtle safe-bottom">
      <div className="flex">
        {TABS.map(({ key, label, Icon }) => {
          const active = current === key
          const showBadge = key === 'session' && hasActiveSession

          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 relative press-effect"
            >
              <div className="relative">
                <Icon
                  size={22}
                  className="transition-colors"
                  style={{ color: active ? '#ff2d55' : '#8e8e93' }}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                {showBadge && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full block border-2 border-white"
                    style={{ backgroundColor: '#ff2d55' }}
                  />
                )}
              </div>
              <span
                className="text-[10px] font-medium tracking-wide transition-colors"
                style={{ color: active ? '#ff2d55' : '#8e8e93' }}
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
