'use client'

import { useReducer, useEffect, useRef, useCallback } from 'react'
import type {
  FlowStep,
  QuickReplyOption,
  FileAttachment,
  ChatMessage,
} from '@/types/chat'
import { chatReducer, initialState } from '@/lib/fluxo-empresa/state-machine'
import { flowContent } from '@/lib/fluxo-empresa/flow-content'
import { simulateAIResponse, simulateUploadDelay } from '@/lib/fluxo-empresa/ai-simulator'
import * as mockBackend from '@/lib/fluxo-empresa/mock-backend'

export function useFluxoEmpresa() {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  const prevStepRef = useRef<FlowStep | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const startedRef = useRef(false)

  const cancelCurrentSimulation = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
  }, [])

  // Execute side effects when flowStep changes
  useEffect(() => {
    if (prevStepRef.current === state.flowStep) return
    prevStepRef.current = state.flowStep

    cancelCurrentSimulation()

    const controller = new AbortController()
    abortRef.current = controller

    const runEffects = async () => {
      const step = state.flowStep

      // --- Backend / async steps (no AI messages, just call and dispatch) ---
      if (step === 'VALIDATING_CNPJ') {
        const result = await mockBackend.validateCNPJ(state.collectedData.cnpj ?? '')
        if (controller.signal.aborted) return
        dispatch({ type: 'BACKEND_CNPJ_RESULT', status: result.status })
        return
      }

      if (step === 'CHECKING_SECTOR') {
        const result = await mockBackend.checkSector(
          state.collectedData.cnpj ?? '',
          state.collectedData.nomeEmpresa ?? ''
        )
        if (controller.signal.aborted) return
        dispatch({ type: 'BACKEND_SECTOR_RESULT', controversial: result.controversial })
        return
      }

      if (step === 'DOCUMENT_UPLOADING' || step === 'LOGO_UPLOADING') {
        await simulateUploadDelay()
        if (controller.signal.aborted) return
        dispatch({ type: 'FILE_UPLOAD_COMPLETE' })
        return
      }

      if (step === 'DOCUMENT_ANALYZING') {
        const fileName = state.currentFile?.name ?? 'document.pdf'
        const result = await mockBackend.analyzeDocument(fileName)
        if (controller.signal.aborted) return
        dispatch({ type: 'BACKEND_DOC_RESULT', result: result.result, reason: result.reason })
        return
      }

      if (step === 'VALIDATING_PIN') {
        // PIN code is passed via the event; we re-validate using the mock (always passes unless ?pin=invalid)
        const result = await mockBackend.validatePin('123456')
        if (controller.signal.aborted) return
        dispatch(result.valid ? { type: 'PIN_VALID' } : { type: 'PIN_INVALID' })
        return
      }

      const content = flowContent[step]

      // Show AI messages for this step (if any)
      if (content && content.messages.length > 0) {
        await simulateAIResponse(content, dispatch, undefined, controller.signal)
        if (controller.signal.aborted) return
      }

      // For steps that end at a composer/quick-reply (user waits to act),
      // simulateAIResponse already set the composer. Nothing more to do.
      // For steps with no messages but a composer (e.g. TERMS_DECISION), set it:
      if (content && content.messages.length === 0) {
        dispatch({ type: '_SET_COMPOSER', mode: content.composerMode })
        if (content.quickReplies) {
          dispatch({ type: '_ENQUEUE_QUICK_REPLIES', options: content.quickReplies })
        }
      }

      // Auto-advance: after showing messages, dispatch _AUTO_ADVANCE to move to next step.
      // The reducer only transitions on _AUTO_ADVANCE for these steps.
      const autoAdvanceSet: Set<FlowStep> = new Set([
        'RESULT_ELIGIBLE', 'SHOW_TERMS',
        'RESULT_AMBIGUOUS',
        'RESULT_NOT_ELIGIBLE',
        'RESULT_CUSTOM_CONTRACT',
      ])

      if (autoAdvanceSet.has(step)) {
        await new Promise(r => setTimeout(r, 400))
        if (controller.signal.aborted) return
        dispatch({ type: '_AUTO_ADVANCE' })
        return
      }
    }

    runEffects()

    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.flowStep])

  // Auto-start the flow on mount
  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true
      dispatch({ type: 'START_FLOW' })
    }
  }, [])

  // === Public API ===

  const sendText = useCallback((text: string) => {
    dispatch({ type: 'USER_TEXT', value: text })
  }, [])

  const selectQuickReply = useCallback((option: QuickReplyOption) => {
    dispatch({
      type: 'QUICK_REPLY_SELECTED',
      value: option.value,
      label: option.label,
      intent: option.intent,
    })
  }, [])

  const selectFile = useCallback((file: File) => {
    const attachment: FileAttachment = {
      name: file.name,
      size: file.size,
      mimeType: file.type,
      previewUrl: URL.createObjectURL(file),
      status: 'selected',
    }
    dispatch({ type: 'FILE_SELECTED', file: attachment })
  }, [])

  const submitFile = useCallback(() => {
    dispatch({ type: 'FILE_SUBMITTED' })
  }, [])

  const submitPin = useCallback((code: string) => {
    dispatch({ type: 'PIN_SUBMITTED', code })
  }, [])

  // Derive active quick replies from last quick-reply-prompt message
  const lastQRPrompt = state.messages.findLast(
    (m: ChatMessage) => m.type === 'quick-reply-prompt'
  )
  const activeQuickReplies = lastQRPrompt?.metadata?.quickReplies ?? null

  return {
    messages: state.messages,
    composerMode: state.composerMode,
    isAiTyping: state.isAiTyping,
    currentFile: state.currentFile,
    flowStep: state.flowStep,
    collectedData: state.collectedData,
    error: state.error,
    activeQuickReplies,
    sendText,
    selectQuickReply,
    selectFile,
    submitFile,
    submitPin,
  }
}
