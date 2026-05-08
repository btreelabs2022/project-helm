import type { Task, TaskPriority } from '../types'
export interface TaskService {
  getTasks(): Promise<Task[]>
  addTask(title: string, priority: TaskPriority, dueDate?: string): Promise<Task>
  updateTask(
    taskId: string,
    updates: Partial<Pick<Task, 'title' | 'priority' | 'completed' | 'starred' | 'dueDate'>>
  ): Promise<Task>
  deleteTask(taskId: string): Promise<void>
  searchTasks(query: string): Promise<Task[]>
}
