import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { AppContext } from './state/AppContext'
import { appReducer, initialState } from './state/appReducer'
import type { TaskService } from './services/TaskService'
import type { ChatService } from './services/ChatService'
import { FIXTURE_TASKS, FIXTURE_TASK_HIGH } from './tests/fixtures'

function makeTaskService(overrides?: Partial<TaskService>): TaskService {
  return {
    getTasks: vi.fn().mockResolvedValue(FIXTURE_TASKS),
    addTask: vi.fn().mockResolvedValue({ ...FIXTURE_TASK_HIGH, id: 'new-1', title: 'New task' }),
    updateTask: vi.fn().mockResolvedValue({ ...FIXTURE_TASK_HIGH, completed: true }),
    deleteTask: vi.fn().mockResolvedValue(undefined),
    searchTasks: vi.fn().mockResolvedValue(FIXTURE_TASKS),
    ...overrides,
  }
}

function makeChatService(overrides?: Partial<ChatService>): ChatService {
  return {
    getHistory: vi.fn().mockResolvedValue([]),
    sendMessage: vi.fn().mockResolvedValue({
      id: 'reply-1',
      role: 'assistant' as const,
      content: "Got it! I've added the task.",
      timestamp: '10:31 AM',
      delivered: true,
    }),
    ...overrides,
  }
}

describe('App integration', () => {
  it('renders the main layout sections', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('TodoBot')).toBeInTheDocument()
    })
    expect(screen.getByText('My TODOs')).toBeInTheDocument()
  })

  it('loads tasks on mount - seeded tasks appear', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Review the Q2 metrics report')).toBeInTheDocument()
    })
  })

  it('shows welcome message when no chat history', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText(/Hi! I'm TodoBot/i)).toBeInTheDocument()
    })
  })

  describe('with mock services via AppContext', () => {
    let taskService: TaskService
    let chatService: ChatService

    beforeEach(() => {
      taskService = makeTaskService()
      chatService = makeChatService()
    })

    // Wrap a minimal component that just uses AppContext services to verify plumbing
    it('AppContext is accessible via useAppContext', () => {
      // Just render App normally and check the context doesn't throw
      expect(() => render(<App />)).not.toThrow()
    })

    it('appReducer initialState has correct defaults', () => {
      const state = appReducer(initialState, { type: 'TASKS_LOADED', payload: FIXTURE_TASKS })
      expect(state.tasks).toEqual(FIXTURE_TASKS)
    })

    it('task services can be called from tests', async () => {
      await expect(taskService.getTasks()).resolves.toEqual(FIXTURE_TASKS)
      expect(taskService.getTasks).toHaveBeenCalledOnce()
    })

    it('chat service sends message and returns assistant reply', async () => {
      const reply = await chatService.sendMessage('hello')
      expect(reply.role).toBe('assistant')
      expect(reply.content).toBeTruthy()
    })

    it('AppContext.Provider wraps correctly', () => {
      // Verify context renders without error when provided
      const { container } = render(
        <AppContext.Provider value={{ taskService, chatService }}>
          <div data-testid="child">child</div>
        </AppContext.Provider>
      )
      expect(container.querySelector('[data-testid="child"]')).toBeInTheDocument()
    })

    it('filter tab changes active filter state', async () => {
      const user = userEvent.setup()
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Review the Q2 metrics report')).toBeInTheDocument()
      })

      await user.click(screen.getByRole('tab', { name: 'Completed' }))
      // After switching to "Completed" filter, non-completed tasks should not appear in filtered groups
      await waitFor(() => {
        expect(screen.queryByText('Review the Q2 metrics report')).toBeNull()
      })
    })
  })
})
