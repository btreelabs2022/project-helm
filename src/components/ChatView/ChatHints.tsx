import styles from './ChatHints.module.css'

interface ChatHintsProps {
  hints: string[]
  onHintClick?: (hint: string) => void
}

export function ChatHints({ hints, onHintClick }: ChatHintsProps) {
  if (hints.length === 0) return null

  return (
    <div className={styles.hints}>
      {hints.map((hint) => (
        <button
          key={hint}
          className={styles.chip}
          onClick={() => onHintClick?.(hint)}
          type="button"
        >
          {hint}
        </button>
      ))}
    </div>
  )
}
