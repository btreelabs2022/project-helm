import type { Task, ChatMessage, NavSection, FilterTab, TaskPriority, AppError } from '../types'

export interface AppState {
  tasks: Task[]
  messages: ChatMessage[]
  activeSection: NavSection
  activeFilter: FilterTab
  searchQuery: string
  collapsedGroups: Set<TaskPriority | 'completed'>
  taskLoading: boolean
  chatLoading: boolean
  error: AppError | null
}

export type AppAction =
  | { type: 'TASKS_LOADED'; payload: Task[] }
  | { type: 'TASK_ADDED'; payload: Task }
  | { type: 'TASK_UPDATED'; payload: Task }
  | { type: 'TASK_DELETED'; payload: { taskId: string } }
  | { type: 'MESSAGE_ADDED'; payload: ChatMessage }
  | { type: 'HISTORY_LOADED'; payload: ChatMessage[] }
  | { type: 'SET_ACTIVE_SECTION'; payload: NavSection }
  | { type: 'SET_ACTIVE_FILTER'; payload: FilterTab }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_GROUP_COLLAPSE'; payload: TaskPriority | 'completed' }
  | { type: 'SET_TASK_LOADING'; payload: boolean }
  | { type: 'SET_CHAT_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: AppError | null }

export const initialState: AppState = {
  tasks: [],
  messages: [],
  activeSection: 'chat',
  activeFilter: 'all',
  searchQuery: '',
  collapsedGroups: new Set(),
  taskLoading: false,
  chatLoading: false,
  error: null,
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TASKS_LOADED':
      return { ...state, tasks: action.payload }
    case 'TASK_ADDED':
      return { ...state, tasks: [action.payload, ...state.tasks] }
    case 'TASK_UPDATED':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)),
      }
    case 'TASK_DELETED':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload.taskId) }
    case 'MESSAGE_ADDED':
      return { ...state, messages: [...state.messages, action.payload] }
    case 'HISTORY_LOADED':
      return { ...state, messages: action.payload }
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload }
    case 'SET_ACTIVE_FILTER':
      return { ...state, activeFilter: action.payload }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    case 'TOGGLE_GROUP_COLLAPSE': {
      const next = new Set(state.collapsedGroups)
      if (next.has(action.payload)) next.delete(action.payload)
      else next.add(action.payload)
      return { ...state, collapsedGroups: next }
    }
    case 'SET_TASK_LOADING':
      return { ...state, taskLoading: action.payload }
    case 'SET_CHAT_LOADING':
      return { ...state, chatLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}
