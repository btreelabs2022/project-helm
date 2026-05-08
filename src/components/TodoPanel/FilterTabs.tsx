import type { FilterTab } from '../../types'
import styles from './FilterTabs.module.css'

interface FilterTabsProps {
  activeTab: FilterTab
  onTabChange: (tab: FilterTab) => void
}

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
]

export function FilterTabs({ activeTab, onTabChange }: FilterTabsProps) {
  return (
    <div className={styles.tabs} role="tablist">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          role="tab"
          aria-selected={activeTab === id}
          className={`${styles.tab}${activeTab === id ? ` ${styles.active}` : ''}`}
          onClick={() => {
            if (activeTab !== id) onTabChange(id)
          }}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  )
}
