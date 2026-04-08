'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { ChatMessage } from '@/types/chat'
import MessageBubbleAI from './MessageBubbleAI'
import MessageBubbleUser from './MessageBubbleUser'
import TypingIndicator from './TypingIndicator'
import TermsBlock from './TermsBlock'

interface MessageListProps {
  messages: ChatMessage[]
  isAiTyping: boolean
}

export default function MessageList({ messages, isAiTyping }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const userScrolledRef = useRef(false)
  const lastCountRef = useRef(0)

  const scrollToBottom = useCallback((instant?: boolean) => {
    const el = containerRef.current
    if (!el) return
    if (instant) {
      el.scrollTop = el.scrollHeight
    } else {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
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
      // Small delay so the new DOM element is painted before scrolling
      requestAnimationFrame(() => scrollToBottom())
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
      className="flex-1 min-h-0 overflow-y-auto message-list-scroll"
      style={{ padding: '28px 24px 16px', overscrollBehavior: 'contain' }}
      // Live region: screen readers announce new messages as they arrive
      aria-live="polite"
      aria-label="Histórico da conversa"
      role="log"
    >
      <div className="flex flex-col message-list-inner">
        {visible.map((msg, idx) => {
          const prev = visible[idx - 1]
          const sameRoleAsPrev = prev && prev.role === msg.role
          const marginTop = idx === 0 ? '0' : sameRoleAsPrev ? '8px' : '20px'

          // Avatar only on the very last AI message of the entire conversation.
          // When AI is typing, the TypingIndicator takes the avatar instead.
          const showAvatar = msg.role === 'ai' && idx === lastAiIdx && !isAiTyping

          if (msg.type === 'terms-prompt') {
            return (
              <div key={msg.id} className="message-enter" style={{ marginTop }}>
                <TermsBlock showAvatar={showAvatar} />
              </div>
            )
          }

          if (msg.role === 'ai') {
            return (
              <div key={msg.id} className="message-enter" style={{ marginTop }}>
                <MessageBubbleAI message={msg} showAvatar={showAvatar} />
              </div>
            )
          }

          if (msg.role === 'user') {
            const userIndex = visible.slice(0, idx + 1).filter((m) => m.role === 'user').length - 1
            return (
              <div key={msg.id} className="message-enter" style={{ marginTop }}>
                <MessageBubbleUser message={msg} colorIndex={userIndex} />
              </div>
            )
          }

          return null
        })}

        {isAiTyping && (
          <div className="message-enter" style={{ marginTop: lastVisible?.role === 'ai' ? '8px' : '20px' }}>
            <TypingIndicator showAvatar />
          </div>
        )}
      </div>
    </div>
  )
}
