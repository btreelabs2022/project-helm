import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NavSidebar } from './NavSidebar'

describe('NavSidebar', () => {
  it('renders all nav buttons', () => {
    render(<NavSidebar activeSection="chat" onNavigate={vi.fn()} />)
    expect(screen.getByLabelText('Chat')).toBeInTheDocument()
    expect(screen.getByLabelText('Tasks')).toBeInTheDocument()
    expect(screen.getByLabelText('Calendar')).toBeInTheDocument()
    expect(screen.getByLabelText('Analytics')).toBeInTheDocument()
    expect(screen.getByLabelText('Settings')).toBeInTheDocument()
  })

  it('active section button has aria-current="page"', () => {
    render(<NavSidebar activeSection="tasks" onNavigate={vi.fn()} />)
    expect(screen.getByLabelText('Tasks')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByLabelText('Chat')).not.toHaveAttribute('aria-current', 'page')
  })

  it('clicking a nav button calls onNavigate with correct section', () => {
    const onNavigate = vi.fn()
    render(<NavSidebar activeSection="chat" onNavigate={onNavigate} />)
    fireEvent.click(screen.getByLabelText('Tasks'))
    expect(onNavigate).toHaveBeenCalledWith('tasks')
  })

  it('renders avatar placeholder when no avatarUrl provided', () => {
    render(<NavSidebar activeSection="chat" onNavigate={vi.fn()} />)
    expect(screen.getByLabelText('User avatar')).toBeInTheDocument()
  })

  it('renders avatar image when avatarUrl is provided', () => {
    render(<NavSidebar activeSection="chat" onNavigate={vi.fn()} avatarUrl="http://example.com/avatar.png" />)
    expect(screen.getByAltText('User avatar')).toBeInTheDocument()
  })
})
