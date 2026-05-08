import { createContext, useContext } from 'react'
import type { TaskService } from '../services/TaskService'
import type { ChatService } from '../services/ChatService'

export interface AppContextValue {
  taskService: TaskService
  chatService: ChatService
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppContext.Provider')
  return ctx
}
