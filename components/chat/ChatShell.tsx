'use client'

import { useState, useEffect, useRef } from 'react'
import { useFluxoEmpresa } from '@/hooks/useFluxoEmpresa'
import MessageList from './MessageList'
import ChatComposer from './ChatComposer'
import QuickReplies from './QuickReplies'
import PreChatShell from './PreChatShell'

// ─── Animation duration (shared between CSS and JS) ───────────────────────────
const TRANSITION_DURATION = 300 // ms

type UIPhase = 'pre-chat' | 'transitioning-out' | 'chat'

export default function ChatShell() {
  const {
    messages,
    composerMode,
    isAiTyping,
    activeQuickReplies,
    flowStep,
    sendText,
    selectQuickReply,
    selectFile,
    submitFile,
    submitPin,
  } = useFluxoEmpresa()

  const [uiPhase, setUIPhase] = useState<UIPhase>('pre-chat')
  const focusTriggerRef = useRef(0)

  // Trigger transition when flowStep reaches WELCOME
  useEffect(() => {
    if (flowStep === 'WELCOME' && uiPhase === 'pre-chat') {
      setUIPhase('transitioning-out')
      const timer = setTimeout(() => {
        focusTriggerRef.current += 1
        setUIPhase('chat')
      }, TRANSITION_DURATION)
      return () => clearTimeout(timer)
    }
  }, [flowStep, uiPhase])

  // ─── Chat content (always rendered once out of pre-chat) ─────────────────────
  const chatContent = (
    <div className="flex flex-col" style={{ height: '100%' }}>
      <MessageList messages={messages} isAiTyping={isAiTyping} />

      {activeQuickReplies && activeQuickReplies.length > 0 && (
        <QuickReplies options={activeQuickReplies} onSelect={selectQuickReply} />
      )}

      <ChatComposer
        mode={composerMode}
        onSendText={sendText}
        onSelectFile={selectFile}
        onSubmitFile={submitFile}
        onSubmitPin={submitPin}
        focusTrigger={focusTriggerRef.current}
      />
    </div>
  )

  // ─── Pre-chat: static render, no animation ───────────────────────────────────
  if (uiPhase === 'pre-chat') {
    return (
      <PreChatShell
        onSelectQuickReply={selectQuickReply}
      />
    )
  }

  // ─── Transitioning-out: pre-chat fades out, chat fades in simultaneously ─────
  if (uiPhase === 'transitioning-out') {
    return (
      <div className="relative" style={{ height: '100%' }}>
        {/* Pre-chat: animates from opacity 1 → 0 */}
        <div
          className="phase-fade-out absolute inset-0"
          style={{ pointerEvents: 'none' }}
        >
          <PreChatShell
            onSelectQuickReply={selectQuickReply}
          />
        </div>

        {/* Chat: animates from opacity 0 → 1 */}
        <div className="phase-fade-in" style={{ height: '100%' }}>
          {chatContent}
        </div>
      </div>
    )
  }

  // ─── Chat: fully visible, pre-chat unmounted ──────────────────────────────────
  return chatContent
}
