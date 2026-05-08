import type { Task, FilterTab, TaskPriority } from '../types'

export function isToday(dateStr: string): boolean {
  const d = new Date(dateStr)
  const t = new Date()
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  )
}

export function isUpcoming(dateStr: string): boolean {
  const d = new Date(dateStr)
  const tomorrow = new Date()
  tomorrow.setHours(0, 0, 0, 0)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return d >= tomorrow
}

export function filterTasks(tasks: Task[], filter: FilterTab, query: string): Task[] {
  let result = tasks
  if (query) {
    const q = query.toLowerCase()
    result = result.filter((t) => t.title.toLowerCase().includes(q))
  }
  switch (filter) {
    case 'today':
      return result.filter((t) => !t.completed && t.dueDate != null && isToday(t.dueDate))
    case 'upcoming':
      return result.filter((t) => !t.completed && t.dueDate != null && isUpcoming(t.dueDate))
    case 'completed':
      return result.filter((t) => t.completed)
    default:
      return result
  }
}

export type GroupedTasks = Record<TaskPriority | 'completed', Task[]>

export function groupTasksByPriority(tasks: Task[]): GroupedTasks {
  const groups: GroupedTasks = { high: [], medium: [], low: [], completed: [] }
  for (const task of tasks) {
    if (task.completed) groups.completed.push(task)
    else groups[task.priority].push(task)
  }
  return groups
}
