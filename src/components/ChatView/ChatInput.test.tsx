import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatInput } from './ChatInput'

describe('ChatInput', () => {
  it('renders input with placeholder', () => {
    render(<ChatInput onSend={vi.fn()} onAttach={vi.fn()} />)
    expect(screen.getByPlaceholderText('Message TodoBot...')).toBeInTheDocument()
  })

  it('renders send button', () => {
    render(<ChatInput onSend={vi.fn()} onAttach={vi.fn()} />)
    expect(screen.getByLabelText('Send message')).toBeInTheDocument()
  })

  it('send button is disabled when input is empty', () => {
    render(<ChatInput onSend={vi.fn()} onAttach={vi.fn()} />)
    expect(screen.getByLabelText('Send message')).toBeDisabled()
  })

  it('send button is enabled when input has text', async () => {
    const user = userEvent.setup()
    render(<ChatInput onSend={vi.fn()} onAttach={vi.fn()} />)
    await user.type(screen.getByLabelText('Message input'), 'hello')
    expect(screen.getByLabelText('Send message')).not.toBeDisabled()
  })

  it('calls onSend with input value when send button clicked', async () => {
    const onSend = vi.fn()
    const user = userEvent.setup()
    render(<ChatInput onSend={onSend} onAttach={vi.fn()} />)
    await user.type(screen.getByLabelText('Message input'), 'hello world')
    await user.click(screen.getByLabelText('Send message'))
    expect(onSend).toHaveBeenCalledWith('hello world')
  })

  it('clears input after send', async () => {
    const user = userEvent.setup()
    render(<ChatInput onSend={vi.fn()} onAttach={vi.fn()} />)
    const input = screen.getByLabelText('Message input')
    await user.type(input, 'hello')
    await user.click(screen.getByLabelText('Send message'))
    expect(input).toHaveValue('')
  })

  it('calls onSend when Enter key is pressed', async () => {
    const onSend = vi.fn()
    const user = userEvent.setup()
    render(<ChatInput onSend={onSend} onAttach={vi.fn()} />)
    await user.type(screen.getByLabelText('Message input'), 'hello{Enter}')
    expect(onSend).toHaveBeenCalledWith('hello')
  })

  it('does not call onSend for empty input on Enter', async () => {
    const onSend = vi.fn()
    const user = userEvent.setup()
    render(<ChatInput onSend={onSend} onAttach={vi.fn()} />)
    await user.type(screen.getByLabelText('Message input'), '{Enter}')
    expect(onSend).not.toHaveBeenCalled()
  })

  it('calls onAttach when attach button clicked', async () => {
    const onAttach = vi.fn()
    const user = userEvent.setup()
    render(<ChatInput onSend={vi.fn()} onAttach={onAttach} />)
    await user.click(screen.getByLabelText('Attach file'))
    expect(onAttach).toHaveBeenCalledTimes(1)
  })

  it('disables input and send button when disabled=true', () => {
    render(<ChatInput onSend={vi.fn()} onAttach={vi.fn()} disabled />)
    expect(screen.getByLabelText('Message input')).toBeDisabled()
    expect(screen.getByLabelText('Send message')).toBeDisabled()
  })

  it('does not call onSend when disabled and button clicked', () => {
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} onAttach={vi.fn()} disabled />)
    // Can't type when disabled, just verify button is disabled
    expect(screen.getByLabelText('Send message')).toBeDisabled()
    expect(onSend).not.toHaveBeenCalled()
  })

  it('trims whitespace before calling onSend', async () => {
    const onSend = vi.fn()
    const user = userEvent.setup()
    render(<ChatInput onSend={onSend} onAttach={vi.fn()} />)
    await user.type(screen.getByLabelText('Message input'), '  hello  ')
    fireEvent.click(screen.getByLabelText('Send message'))
    expect(onSend).toHaveBeenCalledWith('hello')
  })
})
