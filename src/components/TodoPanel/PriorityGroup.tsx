import type { Task, TaskPriority } from '../../types'
import { TaskItem } from './TaskItem'
import styles from './PriorityGroup.module.css'

type GroupKey = TaskPriority | 'completed'

interface PriorityGroupProps {
  groupKey: GroupKey
  tasks: Task[]
  collapsed: boolean
  onToggleCollapse: (key: GroupKey) => void
  onToggleComplete: (taskId: string) => void
  onToggleStar: (taskId: string) => void
  onMenuClick: (taskId: string) => void
}

const GROUP_CONFIG: Record<GroupKey, { label: string; flag: string }> = {
  high: { label: 'High Priority', flag: '🚩' },
  medium: { label: 'Medium Priority', flag: '🟠' },
  low: { label: 'Low Priority', flag: '🟢' },
  completed: { label: 'Completed', flag: '✅' },
}

export function PriorityGroup({
  groupKey,
  tasks,
  collapsed,
  onToggleCollapse,
  onToggleComplete,
  onToggleStar,
  onMenuClick,
}: PriorityGroupProps) {
  const { label, flag } = GROUP_CONFIG[groupKey]

  return (
    <div className={styles.group}>
      <button
        className={styles.header}
        onClick={() => onToggleCollapse(groupKey)}
        aria-expanded={!collapsed}
        type="button"
      >
        <span className={styles.flag} aria-hidden="true">{flag}</span>
        <span className={styles.label}>{label}</span>
        <span className={styles.count}>{tasks.length}</span>
        <span className={styles.toggle}>{collapsed ? '∨' : '∧'}</span>
      </button>
      {!collapsed && (
        <>
          {tasks.length === 0 ? (
            <div className={styles.empty}>No tasks</div>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onToggleStar={onToggleStar}
                onMenuClick={onMenuClick}
              />
            ))
          )}
        </>
      )}
    </div>
  )
}
