export type TaskPriority = 'high' | 'medium' | 'low'
export type FilterTab = 'all' | 'today' | 'upcoming' | 'completed'
export type NavSection = 'chat' | 'tasks' | 'calendar' | 'analytics' | 'settings'

export interface Task {
  id: string
  title: string
  priority: TaskPriority
  completed: boolean
  starred: boolean
  dueDate?: string
  createdAt: string
}

export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  delivered: boolean
  attachedTask?: Task
}

export interface AppError {
  code: 'TASK_SERVICE_ERROR' | 'CHAT_SERVICE_ERROR' | 'UNKNOWN'
  message: string
}
