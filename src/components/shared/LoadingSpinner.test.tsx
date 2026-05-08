import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default aria-label', () => {
    render(<LoadingSpinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom aria-label', () => {
    render(<LoadingSpinner label="Saving..." />)
    expect(screen.getByLabelText('Saving...')).toBeInTheDocument()
  })
})
