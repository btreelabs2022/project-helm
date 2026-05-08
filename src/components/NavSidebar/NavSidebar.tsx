import type { NavSection } from '../../types'
import styles from './NavSidebar.module.css'

interface NavSidebarProps {
  activeSection: NavSection
  onNavigate: (section: NavSection) => void
  avatarUrl?: string
}

const NAV_ITEMS: { section: NavSection; icon: string; label: string }[] = [
  { section: 'chat', icon: '💬', label: 'Chat' },
  { section: 'tasks', icon: '✅', label: 'Tasks' },
  { section: 'calendar', icon: '📅', label: 'Calendar' },
  { section: 'analytics', icon: '📊', label: 'Analytics' },
  { section: 'settings', icon: '⚙️', label: 'Settings' },
]

export function NavSidebar({ activeSection, onNavigate, avatarUrl }: NavSidebarProps) {
  return (
    <nav className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.navItems}>
        {NAV_ITEMS.map(({ section, icon, label }) => (
          <button
            key={section}
            className={`${styles.navBtn}${activeSection === section ? ` ${styles.active}` : ''}`}
            onClick={() => onNavigate(section)}
            aria-label={label}
            aria-current={activeSection === section ? 'page' : undefined}
          >
            {icon}
          </button>
        ))}
      </div>
      <div className={styles.avatar}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="User avatar" className={styles.avatarImg} />
        ) : (
          <div className={styles.avatarPlaceholder} aria-label="User avatar">
            U
          </div>
        )}
      </div>
    </nav>
  )
}
