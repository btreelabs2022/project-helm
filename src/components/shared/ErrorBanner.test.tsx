import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBanner } from './ErrorBanner'
import type { AppError } from '../../types'

describe('ErrorBanner', () => {
  it('renders nothing when error is null', () => {
    const { container } = render(<ErrorBanner error={null} onDismiss={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders error message when error is set', () => {
    const error: AppError = { code: 'UNKNOWN', message: 'Something went wrong' }
    render(<ErrorBanner error={error} onDismiss={vi.fn()} />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = vi.fn()
    const error: AppError = { code: 'TASK_SERVICE_ERROR', message: 'Task error' }
    render(<ErrorBanner error={error} onDismiss={onDismiss} />)
    fireEvent.click(screen.getByLabelText('Dismiss error'))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
