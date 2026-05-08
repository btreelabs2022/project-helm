import type { ChatMessage } from '../../types'
import { TaskCard } from './TaskCard'
import styles from './MessageBubble.module.css'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`${styles.wrapper} ${isUser ? styles.wrapperUser : styles.wrapperAssistant}`}>
      {!isUser && (
        <span className={styles.botAvatar} aria-hidden="true">🤖</span>
      )}
      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAssistant}`}>
        <div className={styles.content}>{message.content}</div>
        {message.attachedTask && <TaskCard task={message.attachedTask} />}
        <div className={`${styles.meta} ${isUser ? styles.metaUser : styles.metaAssistant}`}>
          <span>{message.timestamp}</span>
          {isUser && message.delivered && (
            <span className={styles.checkmark} aria-label="Delivered">✓✓</span>
          )}
        </div>
      </div>
    </div>
  )
}
