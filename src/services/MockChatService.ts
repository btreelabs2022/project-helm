import type { ChatMessage, Task } from '../types'
import type { ChatService } from './ChatService'

function ts() {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

const REPLIES = [
  "Got it! I've added the task.",
  'Here are your top priority tasks for today:\n1. Review the Q2 metrics report\n2. Prepare slides for product meeting\n3. Follow up with design team',
  "Sure! I've updated that task for you.",
  'Done! Task marked as complete.',
]

export class MockChatService implements ChatService {
  private history: ChatMessage[] = []
  private replyIndex = 0

  async getHistory() {
    return [...this.history]
  }

  async sendMessage(content: string): Promise<ChatMessage> {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: ts(),
      delivered: true,
    }
    this.history.push(userMsg)

    const replyContent = REPLIES[this.replyIndex % REPLIES.length]
    this.replyIndex++

    const attachedTask: Task | undefined = content.toLowerCase().includes('add')
      ? {
          id: 'new-' + Date.now(),
          title: content.replace(/^add (a task( to)?)?/i, '').trim() || 'New task',
          priority: 'high',
          completed: false,
          starred: false,
          dueDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }
      : undefined

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: replyContent,
      timestamp: ts(),
      delivered: true,
      attachedTask,
    }
    this.history.push(assistantMsg)
    return assistantMsg
  }
}
