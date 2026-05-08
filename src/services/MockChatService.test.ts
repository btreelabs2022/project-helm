import { describe, it, expect, beforeEach } from 'vitest'
import { MockChatService } from './MockChatService'

describe('MockChatService', () => {
  let service: MockChatService

  beforeEach(() => {
    service = new MockChatService()
  })

  it('getHistory returns empty array initially', async () => {
    const history = await service.getHistory()
    expect(history).toHaveLength(0)
  })

  it('sendMessage returns an assistant message', async () => {
    const reply = await service.sendMessage('hello')
    expect(reply.role).toBe('assistant')
    expect(reply.content).toBeTruthy()
    expect(reply.delivered).toBe(true)
  })

  it('sendMessage stores messages in history', async () => {
    await service.sendMessage('hi there')
    const history = await service.getHistory()
    expect(history.length).toBe(2) // user + assistant
  })

  it('sendMessage cycles through replies', async () => {
    const r1 = await service.sendMessage('msg1')
    await service.sendMessage('msg2')
    await service.sendMessage('msg3')
    await service.sendMessage('msg4')
    const r5 = await service.sendMessage('msg5')
    // Should cycle after 4 replies
    expect(r5.content).toBe(r1.content)
  })

  it('attaches a task when message contains "add"', async () => {
    const reply = await service.sendMessage('add a task to write tests')
    expect(reply.attachedTask).toBeDefined()
  })

  it('does not attach a task for non-add messages', async () => {
    const reply = await service.sendMessage('show my tasks')
    expect(reply.attachedTask).toBeUndefined()
  })

  it('getHistory returns a copy', async () => {
    await service.sendMessage('test')
    const h1 = await service.getHistory()
    const h2 = await service.getHistory()
    expect(h1).not.toBe(h2)
  })
})
