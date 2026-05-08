import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskItem } from './TaskItem'
import { FIXTURE_TASK_HIGH, FIXTURE_TASK_COMPLETED, FIXTURE_TASK_LOW } from '../../tests/fixtures'

describe('TaskItem', () => {
  const handlers = {
    onToggleComplete: vi.fn(),
    onToggleStar: vi.fn(),
    onMenuClick: vi.fn(),
  }

  it('renders task title', () => {
    render(<TaskItem task={FIXTURE_TASK_HIGH} {...handlers} />)
    expect(screen.getByText(FIXTURE_TASK_HIGH.title)).toBeInTheDocument()
  })

  it('renders completion button', () => {
    render(<TaskItem task={FIXTURE_TASK_HIGH} {...handlers} />)
    expect(screen.getByLabelText('Mark complete')).toBeInTheDocument()
  })

  it('completed task shows mark incomplete label', () => {
    render(<TaskItem task={FIXTURE_TASK_COMPLETED} {...handlers} />)
    expect(screen.getByLabelText('Mark incomplete')).toBeInTheDocument()
  })

  it('calls onToggleComplete when complete button clicked', () => {
    const onToggleComplete = vi.fn()
    render(<TaskItem task={FIXTURE_TASK_HIGH} {...handlers} onToggleComplete={onToggleComplete} />)
    fireEvent.click(screen.getByLabelText('Mark complete'))
    expect(onToggleComplete).toHaveBeenCalledWith(FIXTURE_TASK_HIGH.id)
  })

  it('renders priority indicator', () => {
    render(<TaskItem task={FIXTURE_TASK_HIGH} {...handlers} />)
    expect(screen.getByLabelText('high priority')).toBeInTheDocument()
  })

  it('renders star button', () => {
    render(<TaskItem task={FIXTURE_TASK_HIGH} {...handlers} />)
    expect(screen.getByLabelText('Unstar task')).toBeInTheDocument()
  })

  it('renders unstar button for unstarred task', () => {
    render(<TaskItem task={FIXTURE_TASK_LOW} {...handlers} />)
    expect(screen.getByLabelText('Star task')).toBeInTheDocument()
  })

  it('calls onToggleStar when star button clicked', () => {
    const onToggleStar = vi.fn()
    render(<TaskItem task={FIXTURE_TASK_HIGH} {...handlers} onToggleStar={onToggleStar} />)
    fireEvent.click(screen.getByLabelText('Unstar task'))
    expect(onToggleStar).toHaveBeenCalledWith(FIXTURE_TASK_HIGH.id)
  })

  it('renders menu button', () => {
    render(<TaskItem task={FIXTURE_TASK_HIGH} {...handlers} />)
    expect(screen.getByLabelText('Task menu')).toBeInTheDocument()
  })

  it('calls onMenuClick when menu button clicked', () => {
    const onMenuClick = vi.fn()
    render(<TaskItem task={FIXTURE_TASK_HIGH} {...handlers} onMenuClick={onMenuClick} />)
    fireEvent.click(screen.getByLabelText('Task menu'))
    expect(onMenuClick).toHaveBeenCalledWith(FIXTURE_TASK_HIGH.id)
  })

  it('renders dueDate chip when dueDate is present', () => {
    render(<TaskItem task={FIXTURE_TASK_HIGH} {...handlers} />)
    const formatted = new Date(FIXTURE_TASK_HIGH.dueDate!).toLocaleDateString()
    expect(screen.getByText(formatted)).toBeInTheDocument()
  })
})
