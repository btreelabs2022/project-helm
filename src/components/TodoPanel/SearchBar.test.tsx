import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar value="" onChange={vi.fn()} onFilterClick={vi.fn()} />)
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument()
  })

  it('renders the current value', () => {
    render(<SearchBar value="hello" onChange={vi.fn()} onFilterClick={vi.fn()} />)
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument()
  })

  it('calls onChange when typing', () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} onFilterClick={vi.fn()} />)
    fireEvent.change(screen.getByLabelText('Search tasks'), { target: { value: 'test' } })
    expect(onChange).toHaveBeenCalledWith('test')
  })

  it('renders filter button', () => {
    render(<SearchBar value="" onChange={vi.fn()} onFilterClick={vi.fn()} />)
    expect(screen.getByLabelText('Filter tasks')).toBeInTheDocument()
  })

  it('calls onFilterClick when filter button clicked', () => {
    const onFilterClick = vi.fn()
    render(<SearchBar value="" onChange={vi.fn()} onFilterClick={onFilterClick} />)
    fireEvent.click(screen.getByLabelText('Filter tasks'))
    expect(onFilterClick).toHaveBeenCalledTimes(1)
  })

  it('renders search icon', () => {
    render(<SearchBar value="" onChange={vi.fn()} onFilterClick={vi.fn()} />)
    expect(screen.getByText('🔍')).toBeInTheDocument()
  })
})
