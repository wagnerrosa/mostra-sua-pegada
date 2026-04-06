import type {
  ChatState,
  ChatMessage,
  FlowStep,
  FlowEvent,
} from '@/types/chat'

// === Helpers ===

let messageCounter = 0

export function createMessage(
  partial: Omit<ChatMessage, 'id' | 'timestamp'>
): ChatMessage {
  messageCounter++
  return {
    ...partial,
    id: `msg-${messageCounter}-${Date.now()}`,
    timestamp: Date.now(),
  }
}

// === Initial State ===

export const initialState: ChatState = {
  flowStep: 'WELCOME',
  messages: [],
  composerMode: { type: 'loading', label: '' },
  isAiTyping: false,
  currentFile: null,
  collectedData: {},
  error: null,
}

// === Transition table ===

function getNextStep(step: FlowStep, event: FlowEvent): FlowStep {
  switch (step) {
    case 'WELCOME':
      return event.type === 'START_FLOW' ? 'ASK_COMPANY_NAME' : step

    case 'ASK_COMPANY_NAME':
      return event.type === 'USER_TEXT' ? 'ASK_CNPJ' : step

    case 'ASK_CNPJ':
      return event.type === 'USER_TEXT' ? 'VALIDATING_CNPJ' : step

    case 'VALIDATING_CNPJ':
      if (event.type === 'BACKEND_CNPJ_RESULT') {
        switch (event.status) {
          case 'blocked': return 'CNPJ_BLOCKED'
          case 'recadastro': return 'CNPJ_RECADASTRO'
          case 'new': return 'ASK_RESPONSAVEL_NOME'
        }
      }
      return step

    case 'CNPJ_BLOCKED':
      return step // terminal

    case 'CNPJ_RECADASTRO':
      return event.type === '_AUTO_ADVANCE' ? 'ASK_RESPONSAVEL_NOME' : step

    case 'ASK_RESPONSAVEL_NOME':
      return event.type === 'USER_TEXT' ? 'ASK_RESPONSAVEL_EMAIL' : step

    case 'ASK_RESPONSAVEL_EMAIL':
      return event.type === 'USER_TEXT' ? 'ASK_RESPONSAVEL_CARGO' : step

    case 'ASK_RESPONSAVEL_CARGO':
      return event.type === 'USER_TEXT' ? 'ASK_COMO_CONHECEU' : step

    case 'ASK_COMO_CONHECEU':
      return event.type === 'USER_TEXT' ? 'CHECKING_SECTOR' : step

    case 'CHECKING_SECTOR':
      if (event.type === 'BACKEND_SECTOR_RESULT') {
        return event.controversial ? 'SECTOR_CONTROVERSIAL' : 'ASK_DOCUMENT'
      }
      return step

    case 'SECTOR_CONTROVERSIAL':
      return step // terminal

    case 'ASK_DOCUMENT':
      if (event.type === 'FILE_SELECTED') return step // stays, but updates file
      if (event.type === 'FILE_SUBMITTED') return 'DOCUMENT_UPLOADING'
      return step

    case 'DOCUMENT_UPLOADING':
      if (event.type === 'FILE_UPLOAD_COMPLETE') return 'DOCUMENT_ANALYZING'
      if (event.type === 'FILE_UPLOAD_ERROR') return 'ASK_DOCUMENT'
      return step

    case 'DOCUMENT_ANALYZING':
      if (event.type === 'BACKEND_DOC_RESULT') {
        switch (event.result) {
          case 'eligible': return 'RESULT_ELIGIBLE'
          case 'custom_contract': return 'RESULT_CUSTOM_CONTRACT'
          case 'not_eligible': return 'RESULT_NOT_ELIGIBLE'
          case 'ambiguous': return 'RESULT_AMBIGUOUS'
        }
      }
      return step

    // === Eligible path ===
    case 'RESULT_ELIGIBLE':
      return event.type === '_AUTO_ADVANCE' ? 'SHOW_TERMS' : step

    case 'SHOW_TERMS':
      return event.type === '_AUTO_ADVANCE' ? 'TERMS_DECISION' : step

    case 'TERMS_DECISION':
      if (event.type === 'QUICK_REPLY_SELECTED') {
        return event.value === 'accept' ? 'ASK_PIN' : 'FLOW_COMPLETE_NOT_ELIGIBLE'
      }
      return step

    case 'ASK_PIN':
      return event.type === 'PIN_SUBMITTED' ? 'VALIDATING_PIN' : step

    case 'VALIDATING_PIN':
      if (event.type === 'PIN_VALID') return 'ASK_LOGO'
      if (event.type === 'PIN_INVALID') return 'ASK_PIN'
      return step

    case 'ASK_LOGO':
      if (event.type === 'FILE_SELECTED') return step
      if (event.type === 'FILE_SUBMITTED') return 'LOGO_UPLOADING'
      return step

    case 'LOGO_UPLOADING':
      if (event.type === 'FILE_UPLOAD_COMPLETE') return 'FLOW_COMPLETE_ELIGIBLE'
      if (event.type === 'FILE_UPLOAD_ERROR') return 'ASK_LOGO'
      return step

    case 'FLOW_COMPLETE_ELIGIBLE':
      return step // terminal

    // === Custom contract path ===
    case 'RESULT_CUSTOM_CONTRACT':
      return event.type === '_AUTO_ADVANCE' ? 'ASK_CUSTOM_CONTRACT_DETAILS' : step

    case 'ASK_CUSTOM_CONTRACT_DETAILS':
      return event.type === 'USER_TEXT' ? 'ASK_PIN_CUSTOM' : step

    case 'ASK_PIN_CUSTOM':
      return event.type === 'PIN_SUBMITTED' ? 'VALIDATING_PIN_CUSTOM' : step

    case 'VALIDATING_PIN_CUSTOM':
      if (event.type === 'PIN_VALID') return 'ASK_LOGO_CUSTOM'
      if (event.type === 'PIN_INVALID') return 'ASK_PIN_CUSTOM'
      return step

    case 'ASK_LOGO_CUSTOM':
      if (event.type === 'FILE_SELECTED') return step
      if (event.type === 'FILE_SUBMITTED') return 'LOGO_UPLOADING_CUSTOM'
      return step

    case 'LOGO_UPLOADING_CUSTOM':
      if (event.type === 'FILE_UPLOAD_COMPLETE') return 'FLOW_COMPLETE_CUSTOM'
      if (event.type === 'FILE_UPLOAD_ERROR') return 'ASK_LOGO_CUSTOM'
      return step

    case 'FLOW_COMPLETE_CUSTOM':
      return step // terminal

    // === Not eligible path ===
    case 'RESULT_NOT_ELIGIBLE':
      return event.type === '_AUTO_ADVANCE' ? 'ASK_SHARE_CONTACT' : step

    case 'ASK_SHARE_CONTACT':
      if (event.type === 'QUICK_REPLY_SELECTED') return 'FLOW_COMPLETE_NOT_ELIGIBLE'
      return step

    case 'FLOW_COMPLETE_NOT_ELIGIBLE':
      return step // terminal

    // === Ambiguous path ===
    case 'RESULT_AMBIGUOUS':
      return event.type === '_AUTO_ADVANCE' ? 'FLOW_COMPLETE_AMBIGUOUS' : step

    case 'FLOW_COMPLETE_AMBIGUOUS':
      return step // terminal

    default:
      return step
  }
}

// === Data collection ===

function collectData(
  state: ChatState,
  event: FlowEvent
): ChatState['collectedData'] {
  if (event.type !== 'USER_TEXT' && event.type !== 'QUICK_REPLY_SELECTED') {
    return state.collectedData
  }

  const data = { ...state.collectedData }

  if (event.type === 'USER_TEXT') {
    switch (state.flowStep) {
      case 'ASK_COMPANY_NAME':
        data.nomeEmpresa = event.value
        break
      case 'ASK_CNPJ':
        data.cnpj = event.value
        break
      case 'ASK_RESPONSAVEL_NOME':
        data.nomeResponsavel = event.value
        break
      case 'ASK_RESPONSAVEL_EMAIL':
        data.email = event.value
        break
      case 'ASK_RESPONSAVEL_CARGO':
        data.cargo = event.value
        break
      case 'ASK_COMO_CONHECEU':
        data.comoConheceu = event.value
        break
    }
  }

  if (event.type === 'QUICK_REPLY_SELECTED') {
    switch (state.flowStep) {
      case 'TERMS_DECISION':
        data.aceitouTermos = event.value === 'accept'
        break
      case 'ASK_SHARE_CONTACT':
        data.autorizouCompartilhamento = event.value === 'yes'
        break
    }
  }

  return data
}

// === Reducer ===

export function chatReducer(state: ChatState, event: FlowEvent): ChatState {
  // Internal actions: these don't cause step transitions
  switch (event.type) {
    case '_AI_TYPING_START':
      return { ...state, isAiTyping: true }

    case '_AI_TYPING_END':
      return {
        ...state,
        isAiTyping: false,
        messages: [...state.messages, event.message],
      }

    case '_SET_COMPOSER':
      return { ...state, composerMode: event.mode }

    case '_ENQUEUE_QUICK_REPLIES': {
      const qrMessage = createMessage({
        role: 'ai',
        type: 'quick-reply-prompt',
        content: '',
        metadata: { quickReplies: event.options },
      })
      return {
        ...state,
        messages: [...state.messages, qrMessage],
        composerMode: { type: 'quick-reply' },
      }
    }
  }

  // User-facing actions: may cause step transitions

  // Add user message to chat
  let newMessages = [...state.messages]
  let newFile = state.currentFile

  if (event.type === 'USER_TEXT') {
    newMessages.push(
      createMessage({
        role: 'user',
        type: 'text',
        content: event.value,
      })
    )
  }

  if (event.type === 'QUICK_REPLY_SELECTED') {
    // Remove the quick-reply-prompt from visible messages
    newMessages = newMessages.filter(m => m.type !== 'quick-reply-prompt')
    // Add the user's selection as a message (display the label, not the value)
    newMessages.push(
      createMessage({
        role: 'user',
        type: 'quick-reply-answer',
        content: event.label,
        metadata: {
          selectedReply: {
            id: event.value,
            label: event.label,
            value: event.value,
            intent: event.intent,
          },
        },
      })
    )
  }

  if (event.type === 'FILE_SELECTED') {
    newFile = event.file
  }

  if (event.type === 'FILE_SUBMITTED' && state.currentFile) {
    newMessages.push(
      createMessage({
        role: 'user',
        type: 'file-attached',
        content: state.currentFile.name,
        metadata: { file: state.currentFile },
      })
    )
  }

  if (event.type === 'FILE_UPLOAD_ERROR') {
    newFile = null
  }

  if (event.type === 'FILE_UPLOAD_COMPLETE') {
    newFile = null
  }

  // Compute next step
  const nextStep = getNextStep(state.flowStep, event)
  const collectedData = collectData(state, event)

  // Determine composer mode for special states
  let composerMode = state.composerMode

  // File selected → switch to preview mode so user can confirm or remove
  if (event.type === 'FILE_SELECTED' && event.file) {
    composerMode = { type: 'file-preview', file: event.file }
  } else if (nextStep === 'VALIDATING_CNPJ' || nextStep === 'CHECKING_SECTOR') {
    composerMode = { type: 'loading', label: 'Verificando...' }
  } else if (nextStep === 'DOCUMENT_UPLOADING') {
    composerMode = { type: 'loading', label: 'Enviando...' }
  } else if (nextStep === 'DOCUMENT_ANALYZING') {
    composerMode = { type: 'loading', label: 'Analisando...' }
  } else if (nextStep === 'LOGO_UPLOADING' || nextStep === 'LOGO_UPLOADING_CUSTOM') {
    composerMode = { type: 'loading', label: 'Enviando...' }
  } else if (nextStep === 'VALIDATING_PIN' || nextStep === 'VALIDATING_PIN_CUSTOM') {
    composerMode = { type: 'loading', label: 'Verificando...' }
  }

  return {
    ...state,
    flowStep: nextStep,
    messages: newMessages,
    composerMode,
    currentFile: newFile,
    collectedData,
    error: event.type === 'FILE_UPLOAD_ERROR' ? event.error : null,
  }
}
