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

  const visible = messages.filter((m) => m.type !== 'typing')
  const lastVisible = visible[visible.length - 1]

  // Find the index of the very last AI message in the entire conversation
  let lastAiIdx = -1
  for (let i = visible.length - 1; i >= 0; i--) {
    if (visible[i].role === 'ai') { lastAiIdx = i; break }
  }

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
          const sameRoleAsPrev = prev && prev.role === msg.role
          const marginTop = idx === 0 ? '0' : sameRoleAsPrev ? '8px' : '20px'

          // Avatar only on the very last AI message of the entire conversation.
          // When AI is typing, the TypingIndicator takes the avatar instead.
          const showAvatar = msg.role === 'ai' && idx === lastAiIdx && !isAiTyping

          if (msg.role === 'ai') {
            return (
              <div key={msg.id} style={{ marginTop }}>
                <MessageBubbleAI message={msg} showAvatar={showAvatar} />
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
          <div style={{ marginTop: lastVisible?.role === 'ai' ? '8px' : '20px' }}>
            <TypingIndicator showAvatar />
          </div>
        )}
      </div>
    </div>
  )
}
