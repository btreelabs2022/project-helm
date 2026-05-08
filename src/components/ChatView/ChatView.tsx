import type { ChatMessage } from '../../types'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { ChatHints } from './ChatHints'
import styles from './ChatView.module.css'

const DEFAULT_HINTS = [
  'Show my tasks',
  'Add a task',
  'What\'s due today?',
  'Mark as complete',
]

interface ChatViewProps {
  messages: ChatMessage[]
  loading: boolean
  onSendMessage: (content: string) => void
}

export function ChatView({ messages, loading, onSendMessage }: ChatViewProps) {
  return (
    <div className={styles.chatView}>
      <ChatHeader
        onHistoryClick={() => {}}
        onMenuClick={() => {}}
      />
      <MessageList messages={messages} />
      <ChatHints hints={DEFAULT_HINTS} onHintClick={onSendMessage} />
      <ChatInput
        onSend={onSendMessage}
        onAttach={() => {}}
        disabled={loading}
      />
    </div>
  )
}
