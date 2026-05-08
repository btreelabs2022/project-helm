import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatHeader } from './ChatHeader'

describe('ChatHeader', () => {
  it('renders TodoBot heading', () => {
    render(<ChatHeader onHistoryClick={vi.fn()} onMenuClick={vi.fn()} />)
    expect(screen.getByText('TodoBot')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<ChatHeader onHistoryClick={vi.fn()} onMenuClick={vi.fn()} />)
    expect(screen.getByText('Your AI assistant for managing tasks')).toBeInTheDocument()
  })

  it('renders history button', () => {
    render(<ChatHeader onHistoryClick={vi.fn()} onMenuClick={vi.fn()} />)
    expect(screen.getByLabelText('View history')).toBeInTheDocument()
  })

  it('calls onHistoryClick when history button clicked', () => {
    const onHistoryClick = vi.fn()
    render(<ChatHeader onHistoryClick={onHistoryClick} onMenuClick={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('View history'))
    expect(onHistoryClick).toHaveBeenCalledTimes(1)
  })

  it('calls onMenuClick when menu button clicked', () => {
    const onMenuClick = vi.fn()
    render(<ChatHeader onHistoryClick={vi.fn()} onMenuClick={onMenuClick} />)
    fireEvent.click(screen.getByLabelText('Open menu'))
    expect(onMenuClick).toHaveBeenCalledTimes(1)
  })
})
