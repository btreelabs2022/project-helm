import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessageBubble } from './MessageBubble'
import { FIXTURE_MESSAGES, FIXTURE_TASK_HIGH } from '../../tests/fixtures'
import type { ChatMessage } from '../../types'

const userMsg = FIXTURE_MESSAGES[0]
const assistantMsgWithTask = FIXTURE_MESSAGES[1]
const assistantMsg = FIXTURE_MESSAGES[3]

describe('MessageBubble', () => {
  it('renders user message content', () => {
    render(<MessageBubble message={userMsg} />)
    expect(screen.getByText(userMsg.content)).toBeInTheDocument()
  })

  it('renders assistant message content', () => {
    render(<MessageBubble message={assistantMsg} />)
    expect(screen.getByText(assistantMsg.content)).toBeInTheDocument()
  })

  it('renders timestamp', () => {
    render(<MessageBubble message={userMsg} />)
    expect(screen.getByText(userMsg.timestamp)).toBeInTheDocument()
  })

  it('shows double checkmark for delivered user message', () => {
    render(<MessageBubble message={userMsg} />)
    expect(screen.getByLabelText('Delivered')).toBeInTheDocument()
  })

  it('does not show checkmark for undelivered user message', () => {
    const undelivered: ChatMessage = { ...userMsg, delivered: false }
    render(<MessageBubble message={undelivered} />)
    expect(screen.queryByLabelText('Delivered')).toBeNull()
  })

  it('renders bot avatar for assistant message', () => {
    render(<MessageBubble message={assistantMsg} />)
    // bot avatar emoji present
    expect(screen.getByText('🤖')).toBeInTheDocument()
  })

  it('does not render bot avatar for user message', () => {
    render(<MessageBubble message={userMsg} />)
    expect(screen.queryByText('🤖')).toBeNull()
  })

  it('renders TaskCard when attachedTask is present', () => {
    render(<MessageBubble message={assistantMsgWithTask} />)
    expect(screen.getByText(FIXTURE_TASK_HIGH.title)).toBeInTheDocument()
  })

  it('does not render TaskCard when attachedTask is absent', () => {
    render(<MessageBubble message={assistantMsg} />)
    // no task card title from FIXTURE_TASK_HIGH
    expect(screen.queryByText(FIXTURE_TASK_HIGH.title)).toBeNull()
  })

  it('does not show checkmark for assistant message', () => {
    render(<MessageBubble message={assistantMsg} />)
    expect(screen.queryByLabelText('Delivered')).toBeNull()
  })
})
