'use client'

import { useFluxoEmpresa } from '@/hooks/useFluxoEmpresa'
import MessageList from './MessageList'
import ChatComposer from './ChatComposer'
import QuickReplies from './QuickReplies'
import PreChatShell from './PreChatShell'

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

  if (flowStep === 'PRE_CHAT') {
    return (
      <PreChatShell
        onSendText={sendText}
        onSelectQuickReply={selectQuickReply}
      />
    )
  }

  return (
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
      />
    </div>
  )
}
