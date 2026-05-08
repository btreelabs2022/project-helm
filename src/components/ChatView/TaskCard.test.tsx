import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskCard } from './TaskCard'
import { FIXTURE_TASK_HIGH, FIXTURE_TASK_MEDIUM, FIXTURE_TASK_LOW, FIXTURE_TASK_COMPLETED } from '../../tests/fixtures'

describe('TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard task={FIXTURE_TASK_HIGH} />)
    expect(screen.getByText(FIXTURE_TASK_HIGH.title)).toBeInTheDocument()
  })

  it('renders high priority flag', () => {
    render(<TaskCard task={FIXTURE_TASK_HIGH} />)
    expect(screen.getByLabelText('high priority')).toBeInTheDocument()
  })

  it('renders medium priority flag', () => {
    render(<TaskCard task={FIXTURE_TASK_MEDIUM} />)
    expect(screen.getByLabelText('medium priority')).toBeInTheDocument()
  })

  it('renders low priority flag', () => {
    render(<TaskCard task={FIXTURE_TASK_LOW} />)
    expect(screen.getByLabelText('low priority')).toBeInTheDocument()
  })

  it('renders formatted dueDate when present', () => {
    render(<TaskCard task={FIXTURE_TASK_HIGH} />)
    const formatted = new Date(FIXTURE_TASK_HIGH.dueDate!).toLocaleDateString()
    expect(screen.getByText(formatted)).toBeInTheDocument()
  })

  it('does not render dueDate when absent', () => {
    render(<TaskCard task={FIXTURE_TASK_COMPLETED} />)
    // No date chip present
    expect(screen.queryByText(/\d{1,2}\/\d{1,2}\/\d{4}/)).toBeNull()
  })
})
