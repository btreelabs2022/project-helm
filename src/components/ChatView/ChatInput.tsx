import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import styles from './ChatInput.module.css'

interface ChatInputProps {
  onSend: (message: string) => void
  onAttach: () => void
  disabled?: boolean
}

export function ChatInput({ onSend, onAttach, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <button
          className={styles.attachBtn}
          onClick={onAttach}
          aria-label="Attach file"
          disabled={disabled}
          type="button"
        >
          +
        </button>
        <input
          className={styles.input}
          type="text"
          placeholder="Message TodoBot..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Message input"
        />
        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          type="button"
        >
          ➤
        </button>
      </div>
    </div>
  )
}
