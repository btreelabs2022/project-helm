import type { Task } from '../../types'
import styles from './TaskCard.module.css'

interface TaskCardProps {
  task: Task
}

const PRIORITY_FLAGS: Record<Task['priority'], string> = {
  high: '🚩',
  medium: '🟠',
  low: '🟢',
}

export function TaskCard({ task }: TaskCardProps) {
  const flag = PRIORITY_FLAGS[task.priority]
  return (
    <div className={styles.card}>
      <span className={styles.flag} aria-label={`${task.priority} priority`}>{flag}</span>
      <span className={styles.title}>{task.title}</span>
      {task.dueDate && (
        <span className={styles.dueDate}>
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      )}
    </div>
  )
}
