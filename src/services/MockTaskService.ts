import type { Task, TaskPriority } from '../types'
import type { TaskService } from './TaskService'

function now() {
  return new Date().toISOString()
}
function today() {
  const d = new Date()
  d.setHours(9, 0, 0, 0)
  return d.toISOString()
}
function tomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(9, 0, 0, 0)
  return d.toISOString()
}
function future(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(9, 0, 0, 0)
  return d.toISOString()
}

const SEED: Task[] = [
  {
    id: '1',
    title: 'Review the Q2 metrics report',
    priority: 'high',
    completed: false,
    starred: false,
    dueDate: tomorrow(),
    createdAt: now(),
  },
  {
    id: '2',
    title: 'Prepare slides for product meeting',
    priority: 'high',
    completed: false,
    starred: true,
    dueDate: today(),
    createdAt: now(),
  },
  {
    id: '3',
    title: 'Follow up with design team',
    priority: 'medium',
    completed: false,
    starred: false,
    dueDate: today(),
    createdAt: now(),
  },
  {
    id: '4',
    title: 'Update onboarding documentation',
    priority: 'medium',
    completed: false,
    starred: false,
    dueDate: future(3),
    createdAt: now(),
  },
  {
    id: '5',
    title: 'Schedule 1:1 with Alex',
    priority: 'medium',
    completed: false,
    starred: false,
    dueDate: future(5),
    createdAt: now(),
  },
  {
    id: '6',
    title: 'Organize inspiration board',
    priority: 'low',
    completed: false,
    starred: false,
    dueDate: future(10),
    createdAt: now(),
  },
  {
    id: '7',
    title: 'Send weekly report',
    priority: 'high',
    completed: true,
    starred: false,
    createdAt: now(),
  },
]

export class MockTaskService implements TaskService {
  private tasks: Task[] = SEED.map((t) => ({ ...t }))
  private delay() {
    return new Promise((r) => setTimeout(r, 200))
  }

  async getTasks() {
    await this.delay()
    return [...this.tasks]
  }

  async addTask(title: string, priority: TaskPriority, dueDate?: string) {
    await this.delay()
    const task: Task = {
      id: Date.now().toString(),
      title,
      priority,
      completed: false,
      starred: false,
      dueDate,
      createdAt: new Date().toISOString(),
    }
    this.tasks.unshift(task)
    return { ...task }
  }

  async updateTask(
    taskId: string,
    updates: Partial<Pick<Task, 'title' | 'priority' | 'completed' | 'starred' | 'dueDate'>>
  ) {
    await this.delay()
    const idx = this.tasks.findIndex((t) => t.id === taskId)
    if (idx === -1) throw new Error('Task not found')
    this.tasks[idx] = { ...this.tasks[idx], ...updates }
    return { ...this.tasks[idx] }
  }

  async deleteTask(taskId: string) {
    await this.delay()
    this.tasks = this.tasks.filter((t) => t.id !== taskId)
  }

  async searchTasks(query: string) {
    await this.delay()
    if (!query) return [...this.tasks]
    const q = query.toLowerCase()
    return this.tasks.filter((t) => t.title.toLowerCase().includes(q))
  }
}
