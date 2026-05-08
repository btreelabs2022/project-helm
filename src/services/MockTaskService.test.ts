import { describe, it, expect, beforeEach } from 'vitest'
import { MockTaskService } from './MockTaskService'

describe('MockTaskService', () => {
  let service: MockTaskService

  beforeEach(() => {
    service = new MockTaskService()
  })

  it('getTasks returns all seeded tasks', async () => {
    const tasks = await service.getTasks()
    expect(tasks.length).toBeGreaterThan(0)
  })

  it('getTasks returns a copy, not the internal array', async () => {
    const tasks1 = await service.getTasks()
    const tasks2 = await service.getTasks()
    expect(tasks1).not.toBe(tasks2)
  })

  it('addTask adds a new task to the front', async () => {
    await service.addTask('New task', 'high')
    const tasks = await service.getTasks()
    expect(tasks[0].title).toBe('New task')
    expect(tasks[0].priority).toBe('high')
  })

  it('addTask with dueDate stores the dueDate', async () => {
    const due = new Date().toISOString()
    const task = await service.addTask('With due', 'low', due)
    expect(task.dueDate).toBe(due)
  })

  it('addTask returns the new task', async () => {
    const task = await service.addTask('My new task', 'medium')
    expect(task.title).toBe('My new task')
    expect(task.completed).toBe(false)
    expect(task.starred).toBe(false)
  })

  it('updateTask updates a task by id', async () => {
    const tasks = await service.getTasks()
    const id = tasks[0].id
    const updated = await service.updateTask(id, { title: 'Renamed' })
    expect(updated.title).toBe('Renamed')
  })

  it('updateTask throws if task not found', async () => {
    await expect(service.updateTask('nonexistent', { title: 'x' })).rejects.toThrow('Task not found')
  })

  it('deleteTask removes the task', async () => {
    const tasks = await service.getTasks()
    const id = tasks[0].id
    await service.deleteTask(id)
    const after = await service.getTasks()
    expect(after.find((t) => t.id === id)).toBeUndefined()
  })

  it('searchTasks returns all when query is empty', async () => {
    const all = await service.getTasks()
    const result = await service.searchTasks('')
    expect(result.length).toBe(all.length)
  })

  it('searchTasks filters by case-insensitive title match', async () => {
    const result = await service.searchTasks('Q2 metrics')
    expect(result.every((t) => t.title.toLowerCase().includes('q2 metrics'))).toBe(true)
  })

  it('searchTasks returns empty array for no match', async () => {
    const result = await service.searchTasks('xyznotfound')
    expect(result).toHaveLength(0)
  })
})
