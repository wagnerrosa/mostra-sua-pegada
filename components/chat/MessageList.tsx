'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { ChatMessage } from '@/types/chat'
import MessageBubbleAI from './MessageBubbleAI'
import MessageBubbleUser from './MessageBubbleUser'
import TypingIndicator from './TypingIndicator'

interface MessageListProps {
  messages: ChatMessage[]
  isAiTyping: boolean
}

export default function MessageList({ messages, isAiTyping }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const userScrolledRef = useRef(false)
  const lastCountRef = useRef(0)

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [])

  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
    userScrolledRef.current = !atBottom
  }, [])

  useEffect(() => {
    const newCount = messages.length + (isAiTyping ? 1 : 0)
    if (newCount > lastCountRef.current && !userScrolledRef.current) {
      scrollToBottom()
    }
    lastCountRef.current = newCount
  }, [messages.length, isAiTyping, scrollToBottom])

  // Filter out internal 'typing' type messages (handled by isAiTyping prop)
  const visible = messages.filter((m) => m.type !== 'typing')

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto"
      style={{ padding: '28px 24px 16px' }}
    >
      <div className="flex flex-col">
        {visible.map((msg, idx) => {
          const prev = visible[idx - 1]
          // Larger gap when role changes, smaller within the same speaker
          const sameRoleAsPrev = prev && prev.role === msg.role
          const marginTop = idx === 0 ? '0' : sameRoleAsPrev ? '8px' : '20px'

          if (msg.role === 'ai') {
            return (
              <div key={msg.id} style={{ marginTop }}>
                <MessageBubbleAI message={msg} />
              </div>
            )
          }

          if (msg.role === 'user') {
            return (
              <div key={msg.id} style={{ marginTop }}>
                <MessageBubbleUser message={msg} />
              </div>
            )
          }

          return null
        })}

        {isAiTyping && (
          <div style={{ marginTop: visible.length > 0 && visible[visible.length - 1]?.role === 'ai' ? '8px' : '20px' }}>
            <TypingIndicator />
          </div>
        )}
      </div>
    </div>
  )
}
