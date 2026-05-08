import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../../types'
import { MessageBubble } from './MessageBubble'
import styles from './MessageList.module.css'

interface MessageListProps {
  messages: ChatMessage[]
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bottomRef.current && typeof bottomRef.current.scrollIntoView === 'function') {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className={styles.list}>
      {messages.length === 0 ? (
        <div className={styles.welcome}>
          <span className={styles.welcomeIcon}>🤖</span>
          <p className={styles.welcomeTitle}>Hi! I&apos;m TodoBot</p>
          <p className={styles.welcomeText}>
            Ask me to add tasks, check your priorities, or manage your todo list.
          </p>
        </div>
      ) : (
        messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
      )}
      <div ref={bottomRef} />
    </div>
  )
}
