import styles from './ChatHeader.module.css'

interface ChatHeaderProps {
  onHistoryClick: () => void
  onMenuClick: () => void
}

export function ChatHeader({ onHistoryClick, onMenuClick }: ChatHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.avatar} aria-hidden="true">🤖</div>
      <div className={styles.info}>
        <h1 className={styles.title}>TodoBot</h1>
        <p className={styles.subtitle}>Your AI assistant for managing tasks</p>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.iconBtn}
          onClick={onHistoryClick}
          aria-label="View history"
        >
          🕐
        </button>
        <button
          className={styles.iconBtn}
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          ⋮
        </button>
      </div>
    </header>
  )
}
