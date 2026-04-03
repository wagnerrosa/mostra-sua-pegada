'use client'

import { useFluxoEmpresa } from '@/hooks/useFluxoEmpresa'
import MessageList from './MessageList'
import ChatComposer from './ChatComposer'
import QuickReplies from './QuickReplies'

export default function ChatShell() {
  const {
    messages,
    composerMode,
    isAiTyping,
    activeQuickReplies,
    sendText,
    selectQuickReply,
    selectFile,
    submitFile,
    submitPin,
  } = useFluxoEmpresa()

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
