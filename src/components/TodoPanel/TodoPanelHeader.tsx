import styles from './TodoPanelHeader.module.css'

interface TodoPanelHeaderProps {
  onAddTask: () => void
}

export function TodoPanelHeader({ onAddTask }: TodoPanelHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>My TODOs</h2>
      <button className={styles.addBtn} onClick={onAddTask} type="button">
        + Add Task
      </button>
    </div>
  )
}
