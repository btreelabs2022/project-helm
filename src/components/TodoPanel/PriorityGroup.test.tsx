import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PriorityGroup } from './PriorityGroup'
import { FIXTURE_TASK_HIGH, FIXTURE_TASK_MEDIUM } from '../../tests/fixtures'
import type { Task } from '../../types'

const mockHandlers = {
  onToggleCollapse: vi.fn(),
  onToggleComplete: vi.fn(),
  onToggleStar: vi.fn(),
  onMenuClick: vi.fn(),
}

describe('PriorityGroup', () => {
  it('renders group label for high priority', () => {
    render(<PriorityGroup groupKey="high" tasks={[FIXTURE_TASK_HIGH]} collapsed={false} {...mockHandlers} />)
    expect(screen.getByText('High Priority')).toBeInTheDocument()
  })

  it('renders task count badge', () => {
    render(<PriorityGroup groupKey="high" tasks={[FIXTURE_TASK_HIGH, FIXTURE_TASK_MEDIUM]} collapsed={false} {...mockHandlers} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders task items when not collapsed', () => {
    render(<PriorityGroup groupKey="high" tasks={[FIXTURE_TASK_HIGH]} collapsed={false} {...mockHandlers} />)
    expect(screen.getByText(FIXTURE_TASK_HIGH.title)).toBeInTheDocument()
  })

  it('hides task items when collapsed', () => {
    render(<PriorityGroup groupKey="high" tasks={[FIXTURE_TASK_HIGH]} collapsed={true} {...mockHandlers} />)
    expect(screen.queryByText(FIXTURE_TASK_HIGH.title)).toBeNull()
  })

  it('shows "No tasks" for empty non-collapsed group', () => {
    render(<PriorityGroup groupKey="high" tasks={[]} collapsed={false} {...mockHandlers} />)
    expect(screen.getByText('No tasks')).toBeInTheDocument()
  })

  it('calls onToggleCollapse when header is clicked', () => {
    const onToggleCollapse = vi.fn()
    render(<PriorityGroup groupKey="medium" tasks={[]} collapsed={false} {...mockHandlers} onToggleCollapse={onToggleCollapse} />)
    fireEvent.click(screen.getByRole('button', { name: /medium priority/i }))
    expect(onToggleCollapse).toHaveBeenCalledWith('medium')
  })

  it('shows collapse toggle arrow', () => {
    render(<PriorityGroup groupKey="high" tasks={[]} collapsed={false} {...mockHandlers} />)
    expect(screen.getByText('∧')).toBeInTheDocument()
  })

  it('shows expand toggle arrow when collapsed', () => {
    render(<PriorityGroup groupKey="high" tasks={[]} collapsed={true} {...mockHandlers} />)
    expect(screen.getByText('∨')).toBeInTheDocument()
  })

  it('renders all tasks in the group', () => {
    const tasks: Task[] = [FIXTURE_TASK_HIGH, { ...FIXTURE_TASK_HIGH, id: 't5', title: 'Another task' }]
    render(<PriorityGroup groupKey="high" tasks={tasks} collapsed={false} {...mockHandlers} />)
    expect(screen.getByText(FIXTURE_TASK_HIGH.title)).toBeInTheDocument()
    expect(screen.getByText('Another task')).toBeInTheDocument()
  })
})
