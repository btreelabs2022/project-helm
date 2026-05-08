import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterTabs } from './FilterTabs'

describe('FilterTabs', () => {
  it('renders all four tabs', () => {
    render(<FilterTabs activeTab="all" onTabChange={vi.fn()} />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Upcoming')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('active tab has aria-selected="true"', () => {
    render(<FilterTabs activeTab="today" onTabChange={vi.fn()} />)
    expect(screen.getByText('Today')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('All')).toHaveAttribute('aria-selected', 'false')
  })

  it('clicking inactive tab calls onTabChange', () => {
    const onTabChange = vi.fn()
    render(<FilterTabs activeTab="all" onTabChange={onTabChange} />)
    fireEvent.click(screen.getByText('Today'))
    expect(onTabChange).toHaveBeenCalledWith('today')
  })

  it('clicking active tab does not call onTabChange', () => {
    const onTabChange = vi.fn()
    render(<FilterTabs activeTab="all" onTabChange={onTabChange} />)
    fireEvent.click(screen.getByText('All'))
    expect(onTabChange).not.toHaveBeenCalled()
  })
})
