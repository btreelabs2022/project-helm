import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TodoPanelHeader } from './TodoPanelHeader'

describe('TodoPanelHeader', () => {
  it('renders "My TODOs" heading', () => {
    render(<TodoPanelHeader onAddTask={vi.fn()} />)
    expect(screen.getByText('My TODOs')).toBeInTheDocument()
  })

  it('renders Add Task button', () => {
    render(<TodoPanelHeader onAddTask={vi.fn()} />)
    expect(screen.getByText('+ Add Task')).toBeInTheDocument()
  })

  it('calls onAddTask when button is clicked', () => {
    const onAddTask = vi.fn()
    render(<TodoPanelHeader onAddTask={onAddTask} />)
    fireEvent.click(screen.getByText('+ Add Task'))
    expect(onAddTask).toHaveBeenCalledTimes(1)
  })
})
