import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatHints } from './ChatHints'

describe('ChatHints', () => {
  it('renders nothing when hints array is empty', () => {
    const { container } = render(<ChatHints hints={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders hint chips and calls onHintClick', () => {
    const onHintClick = vi.fn()
    render(<ChatHints hints={['Add a task', 'Show tasks']} onHintClick={onHintClick} />)
    expect(screen.getByText('Add a task')).toBeInTheDocument()
    expect(screen.getByText('Show tasks')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Add a task'))
    expect(onHintClick).toHaveBeenCalledWith('Add a task')
  })
})
