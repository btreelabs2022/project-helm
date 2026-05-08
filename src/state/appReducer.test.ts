import { describe, it, expect } from 'vitest'
import { appReducer, initialState } from './appReducer'
import { filterTasks, groupTasksByPriority, isToday, isUpcoming } from './taskHelpers'
import { FIXTURE_TASKS, FIXTURE_TASK_HIGH, FIXTURE_TASK_MEDIUM, FIXTURE_TASK_LOW, FIXTURE_TASK_COMPLETED } from '../tests/fixtures'

describe('appReducer', () => {
  it('TASKS_LOADED replaces tasks', () => {
    const state = appReducer(initialState, { type: 'TASKS_LOADED', payload: FIXTURE_TASKS })
    expect(state.tasks).toEqual(FIXTURE_TASKS)
  })

  it('TASK_ADDED prepends a task', () => {
    const s1 = appReducer(initialState, { type: 'TASKS_LOADED', payload: FIXTURE_TASKS })
    const newTask = { ...FIXTURE_TASK_HIGH, id: 'new' }
    const s2 = appReducer(s1, { type: 'TASK_ADDED', payload: newTask })
    expect(s2.tasks[0]).toEqual(newTask)
    expect(s2.tasks.length).toBe(FIXTURE_TASKS.length + 1)
  })

  it('TASK_UPDATED updates an existing task', () => {
    const s1 = appReducer(initialState, { type: 'TASKS_LOADED', payload: FIXTURE_TASKS })
    const updated = { ...FIXTURE_TASK_HIGH, title: 'Updated title' }
    const s2 = appReducer(s1, { type: 'TASK_UPDATED', payload: updated })
    expect(s2.tasks.find((t) => t.id === FIXTURE_TASK_HIGH.id)?.title).toBe('Updated title')
  })

  it('TASK_DELETED removes the task', () => {
    const s1 = appReducer(initialState, { type: 'TASKS_LOADED', payload: FIXTURE_TASKS })
    const s2 = appReducer(s1, { type: 'TASK_DELETED', payload: { taskId: FIXTURE_TASK_HIGH.id } })
    expect(s2.tasks.find((t) => t.id === FIXTURE_TASK_HIGH.id)).toBeUndefined()
  })

  it('MESSAGE_ADDED appends message', () => {
    const msg = { id: 'm1', role: 'user' as const, content: 'hello', timestamp: '10:00', delivered: true }
    const state = appReducer(initialState, { type: 'MESSAGE_ADDED', payload: msg })
    expect(state.messages).toHaveLength(1)
    expect(state.messages[0]).toEqual(msg)
  })

  it('HISTORY_LOADED replaces messages', () => {
    const msgs = [
      { id: 'm1', role: 'user' as const, content: 'hello', timestamp: '10:00', delivered: true },
    ]
    const state = appReducer(initialState, { type: 'HISTORY_LOADED', payload: msgs })
    expect(state.messages).toEqual(msgs)
  })

  it('SET_ACTIVE_SECTION changes section', () => {
    const state = appReducer(initialState, { type: 'SET_ACTIVE_SECTION', payload: 'tasks' })
    expect(state.activeSection).toBe('tasks')
  })

  it('SET_ACTIVE_FILTER changes filter', () => {
    const state = appReducer(initialState, { type: 'SET_ACTIVE_FILTER', payload: 'today' })
    expect(state.activeFilter).toBe('today')
  })

  it('SET_SEARCH_QUERY changes query', () => {
    const state = appReducer(initialState, { type: 'SET_SEARCH_QUERY', payload: 'foo' })
    expect(state.searchQuery).toBe('foo')
  })

  it('TOGGLE_GROUP_COLLAPSE collapses and expands', () => {
    const s1 = appReducer(initialState, { type: 'TOGGLE_GROUP_COLLAPSE', payload: 'high' })
    expect(s1.collapsedGroups.has('high')).toBe(true)
    const s2 = appReducer(s1, { type: 'TOGGLE_GROUP_COLLAPSE', payload: 'high' })
    expect(s2.collapsedGroups.has('high')).toBe(false)
  })

  it('SET_TASK_LOADING updates taskLoading', () => {
    const state = appReducer(initialState, { type: 'SET_TASK_LOADING', payload: true })
    expect(state.taskLoading).toBe(true)
  })

  it('SET_CHAT_LOADING updates chatLoading', () => {
    const state = appReducer(initialState, { type: 'SET_CHAT_LOADING', payload: true })
    expect(state.chatLoading).toBe(true)
  })

  it('SET_ERROR sets error', () => {
    const err = { code: 'UNKNOWN' as const, message: 'oops' }
    const s1 = appReducer(initialState, { type: 'SET_ERROR', payload: err })
    expect(s1.error).toEqual(err)
    const s2 = appReducer(s1, { type: 'SET_ERROR', payload: null })
    expect(s2.error).toBeNull()
  })
})

describe('filterTasks', () => {
  it('returns all tasks for "all" filter', () => {
    const result = filterTasks(FIXTURE_TASKS, 'all', '')
    expect(result).toHaveLength(FIXTURE_TASKS.length)
  })

  it('filters by query', () => {
    const result = filterTasks(FIXTURE_TASKS, 'all', 'Q2')
    expect(result.every((t) => t.title.toLowerCase().includes('q2'))).toBe(true)
  })

  it('filters today tasks', () => {
    const result = filterTasks(FIXTURE_TASKS, 'today', '')
    result.forEach((t) => {
      expect(t.completed).toBe(false)
      expect(t.dueDate).toBeDefined()
      expect(isToday(t.dueDate!)).toBe(true)
    })
  })

  it('filters upcoming tasks', () => {
    const result = filterTasks(FIXTURE_TASKS, 'upcoming', '')
    result.forEach((t) => {
      expect(t.completed).toBe(false)
      expect(t.dueDate).toBeDefined()
      expect(isUpcoming(t.dueDate!)).toBe(true)
    })
  })

  it('filters completed tasks', () => {
    const result = filterTasks(FIXTURE_TASKS, 'completed', '')
    result.forEach((t) => expect(t.completed).toBe(true))
  })
})

describe('groupTasksByPriority', () => {
  it('groups tasks by priority', () => {
    const groups = groupTasksByPriority(FIXTURE_TASKS)
    expect(groups.high).toContain(FIXTURE_TASK_HIGH)
    expect(groups.medium).toContain(FIXTURE_TASK_MEDIUM)
    expect(groups.low).toContain(FIXTURE_TASK_LOW)
    expect(groups.completed).toContain(FIXTURE_TASK_COMPLETED)
  })

  it('completed tasks go to completed group regardless of priority', () => {
    const groups = groupTasksByPriority(FIXTURE_TASKS)
    expect(groups.completed).not.toContain(FIXTURE_TASK_HIGH)
    expect(groups.high).not.toContain(FIXTURE_TASK_COMPLETED)
  })

  it('returns empty arrays for empty groups', () => {
    const groups = groupTasksByPriority([FIXTURE_TASK_HIGH])
    expect(groups.medium).toHaveLength(0)
    expect(groups.low).toHaveLength(0)
    expect(groups.completed).toHaveLength(0)
  })
})
