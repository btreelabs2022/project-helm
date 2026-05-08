import styles from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  label?: string
}

export function LoadingSpinner({ label = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div role="status" aria-label={label} className={styles.spinner} />
  )
}
