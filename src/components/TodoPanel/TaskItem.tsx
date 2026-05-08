import type { Task } from '../../types'
import styles from './TaskItem.module.css'

interface TaskItemProps {
  task: Task
  onToggleComplete: (taskId: string) => void
  onToggleStar: (taskId: string) => void
  onMenuClick: (taskId: string) => void
}

const PRIORITY_ARROWS: Record<Task['priority'], string> = {
  high: '↑',
  medium: '→',
  low: '↓',
}

const PRIORITY_COLORS: Record<Task['priority'], string> = {
  high: '#ef4444',
  medium: '#f97316',
  low: '#22c55e',
}

export function TaskItem({ task, onToggleComplete, onToggleStar, onMenuClick }: TaskItemProps) {
  return (
    <div className={styles.item}>
      <button
        className={`${styles.completeBtn}${task.completed ? ` ${styles.completed}` : ''}`}
        onClick={() => onToggleComplete(task.id)}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        type="button"
      >
        {task.completed ? '✓' : ''}
      </button>
      <span
        className={styles.priority}
        style={{ color: PRIORITY_COLORS[task.priority] }}
        aria-label={`${task.priority} priority`}
      >
        {PRIORITY_ARROWS[task.priority]}
      </span>
      <span className={`${styles.title}${task.completed ? ` ${styles.titleCompleted}` : ''}`}>
        {task.title}
      </span>
      {task.dueDate && (
        <span className={styles.dueChip}>
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      )}
      <button
        className={`${styles.starBtn}${task.starred ? ` ${styles.starred}` : ''}`}
        onClick={() => onToggleStar(task.id)}
        aria-label={task.starred ? 'Unstar task' : 'Star task'}
        type="button"
      >
        {task.starred ? '★' : '☆'}
      </button>
      <button
        className={styles.menuBtn}
        onClick={() => onMenuClick(task.id)}
        aria-label="Task menu"
        type="button"
      >
        ⋮
      </button>
    </div>
  )
}
