import styles from './SearchBar.module.css'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onFilterClick: () => void
}

export function SearchBar({ value, onChange, onFilterClick }: SearchBarProps) {
  return (
    <div className={styles.container}>
      <span className={styles.searchIcon} aria-hidden="true">🔍</span>
      <input
        className={styles.input}
        type="text"
        placeholder="Search tasks..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search tasks"
      />
      <button
        className={styles.filterBtn}
        onClick={onFilterClick}
        aria-label="Filter tasks"
        type="button"
      >
        ⊟
      </button>
    </div>
  )
}
