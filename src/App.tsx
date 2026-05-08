import { useReducer, useMemo, useEffect } from 'react'
import { appReducer, initialState } from './state/appReducer'
import { filterTasks, groupTasksByPriority } from './state/taskHelpers'
import { AppContext } from './state/AppContext'
import { MockTaskService } from './services/MockTaskService'
import { MockChatService } from './services/MockChatService'
import { NavSidebar } from './components/NavSidebar/NavSidebar'
import { ChatView } from './components/ChatView/ChatView'
import { TodoPanel } from './components/TodoPanel/TodoPanel'
import { ErrorBanner } from './components/shared/ErrorBanner'
import type { NavSection, TaskPriority } from './types'
import './App.css'

type GroupKey = TaskPriority | 'completed'

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const taskService = useMemo(() => new MockTaskService(), [])
  const chatService = useMemo(() => new MockChatService(), [])

  useEffect(() => {
    dispatch({ type: 'SET_TASK_LOADING', payload: true })
    taskService.getTasks()
      .then((tasks) => {
        dispatch({ type: 'TASKS_LOADED', payload: tasks })
      })
      .catch(() => {
        dispatch({ type: 'SET_ERROR', payload: { code: 'TASK_SERVICE_ERROR', message: 'Failed to load tasks' } })
      })
      .finally(() => {
        dispatch({ type: 'SET_TASK_LOADING', payload: false })
      })

    chatService.getHistory()
      .then((messages) => {
        dispatch({ type: 'HISTORY_LOADED', payload: messages })
      })
      .catch(() => {
        dispatch({ type: 'SET_ERROR', payload: { code: 'CHAT_SERVICE_ERROR', message: 'Failed to load chat history' } })
      })
  }, [taskService, chatService])

  const filteredTasks = useMemo(
    () => filterTasks(state.tasks, state.activeFilter, state.searchQuery),
    [state.tasks, state.activeFilter, state.searchQuery]
  )

  const groupedTasks = useMemo(
    () => groupTasksByPriority(filteredTasks),
    [filteredTasks]
  )

  const handleSendMessage = async (content: string) => {
    dispatch({ type: 'SET_CHAT_LOADING', payload: true })
    try {
      const userMsg = {
        id: Date.now().toString(),
        role: 'user' as const,
        content,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        delivered: false,
      }
      dispatch({ type: 'MESSAGE_ADDED', payload: userMsg })

      const assistantMsg = await chatService.sendMessage(content)
      // Replace user message (sent via service) and add assistant reply
      dispatch({ type: 'MESSAGE_ADDED', payload: { ...userMsg, delivered: true } })
      dispatch({ type: 'MESSAGE_ADDED', payload: assistantMsg })

      if (assistantMsg.attachedTask) {
        dispatch({ type: 'TASK_ADDED', payload: assistantMsg.attachedTask })
      }
    } catch {
      dispatch({ type: 'SET_ERROR', payload: { code: 'CHAT_SERVICE_ERROR', message: 'Failed to send message' } })
    } finally {
      dispatch({ type: 'SET_CHAT_LOADING', payload: false })
    }
  }

  const handleAddTask = () => {
    const title = window.prompt('Task title')
    if (!title?.trim()) return
    dispatch({ type: 'SET_TASK_LOADING', payload: true })
    taskService.addTask(title.trim(), 'medium')
      .then((task) => {
        dispatch({ type: 'TASK_ADDED', payload: task })
      })
      .catch(() => {
        dispatch({ type: 'SET_ERROR', payload: { code: 'TASK_SERVICE_ERROR', message: 'Failed to add task' } })
      })
      .finally(() => {
        dispatch({ type: 'SET_TASK_LOADING', payload: false })
      })
  }

  const handleToggleComplete = (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId)
    if (!task) return
    taskService.updateTask(taskId, { completed: !task.completed })
      .then((updated) => {
        dispatch({ type: 'TASK_UPDATED', payload: updated })
      })
      .catch(() => {
        dispatch({ type: 'SET_ERROR', payload: { code: 'TASK_SERVICE_ERROR', message: 'Failed to update task' } })
      })
  }

  const handleToggleStar = (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId)
    if (!task) return
    taskService.updateTask(taskId, { starred: !task.starred })
      .then((updated) => {
        dispatch({ type: 'TASK_UPDATED', payload: updated })
      })
      .catch(() => {
        dispatch({ type: 'SET_ERROR', payload: { code: 'TASK_SERVICE_ERROR', message: 'Failed to update task' } })
      })
  }

  return (
    <AppContext.Provider value={{ taskService, chatService }}>
      <div className="app">
        <NavSidebar
          activeSection={state.activeSection}
          onNavigate={(section: NavSection) => dispatch({ type: 'SET_ACTIVE_SECTION', payload: section })}
        />
        <div className="chat-region">
          <ErrorBanner
            error={state.error}
            onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
          />
          <ChatView
            messages={state.messages}
            loading={state.chatLoading}
            onSendMessage={handleSendMessage}
          />
        </div>
        <div className="todo-region">
          <TodoPanel
            groupedTasks={groupedTasks}
            activeFilter={state.activeFilter}
            searchQuery={state.searchQuery}
            collapsedGroups={state.collapsedGroups}
            onAddTask={handleAddTask}
            onSearchChange={(query) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query })}
            onFilterChange={(tab) => dispatch({ type: 'SET_ACTIVE_FILTER', payload: tab })}
            onToggleGroupCollapse={(key: GroupKey) => dispatch({ type: 'TOGGLE_GROUP_COLLAPSE', payload: key })}
            onToggleComplete={handleToggleComplete}
            onToggleStar={handleToggleStar}
            onMenuClick={() => {}}
          />
        </div>
      </div>
    </AppContext.Provider>
  )
}

export default App
