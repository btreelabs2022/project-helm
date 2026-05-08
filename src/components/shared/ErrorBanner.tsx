import type { AppError } from '../../types'
import styles from './ErrorBanner.module.css'

interface ErrorBannerProps {
  error: AppError | null
  onDismiss: () => void
}

export function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  if (!error) return null

  return (
    <div className={styles.banner} role="alert">
      <span>{error.message}</span>
      <button className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss error">
        ×
      </button>
    </div>
  )
}
