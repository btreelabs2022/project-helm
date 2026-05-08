import type { ChatMessage } from '../types'
export interface ChatService {
  sendMessage(content: string): Promise<ChatMessage>
  getHistory(): Promise<ChatMessage[]>
}
