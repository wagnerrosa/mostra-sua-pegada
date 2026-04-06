// === Tipos base ===

export type MessageRole = 'ai' | 'user' | 'system'

export type MessageType =
  | 'text'
  | 'quick-reply-prompt'
  | 'quick-reply-answer'
  | 'file-request'
  | 'file-attached'
  | 'file-uploading'
  | 'file-analyzing'
  | 'file-error'
  | 'typing'
  | 'terms-prompt'
  | 'pin-request'
  | 'flow-end'

// === Quick Reply ===

export type QuickReplyIntent = 'confirm' | 'reject' | 'neutral' | 'action'

export interface QuickReplyOption {
  id: string
  label: string
  value: string
  intent: QuickReplyIntent
}

// === Arquivo ===

export interface FileAttachment {
  name: string
  size: number
  mimeType: string
  previewUrl?: string
  uploadProgress?: number
  status: 'selected' | 'uploading' | 'uploaded' | 'analyzing' | 'error'
  errorMessage?: string
}

// === Mensagem principal ===

export interface ChatMessage {
  id: string
  role: MessageRole
  type: MessageType
  content: string
  timestamp: number
  metadata?: {
    quickReplies?: QuickReplyOption[]
    selectedReply?: QuickReplyOption
    file?: FileAttachment
    termsUrl?: string
    pinLength?: number
    contactEmail?: string
  }
}

// === Composer ===

export type ComposerMode =
  | { type: 'text'; placeholder: string; validation?: RegExp }
  | { type: 'text-long'; placeholder: string; maxLength: number }
  | { type: 'quick-reply' }
  | { type: 'file'; accept: string; label: string }
  | { type: 'file-preview'; file: FileAttachment }
  | { type: 'pin'; length: number }
  | { type: 'disabled'; reason: string }
  | { type: 'loading'; label: string }

// === Flow Steps ===

export type FlowStep =
  // Coleta sequencial
  | 'WELCOME'
  | 'ASK_COMPANY_NAME'
  | 'ASK_CNPJ'
  | 'VALIDATING_CNPJ'
  | 'ASK_RESPONSAVEL_NOME'
  | 'ASK_RESPONSAVEL_EMAIL'
  | 'ASK_RESPONSAVEL_CARGO'
  | 'ASK_COMO_CONHECEU'
  | 'CHECKING_SECTOR'
  // Ramos de bloqueio
  | 'CNPJ_BLOCKED'
  | 'CNPJ_RECADASTRO'
  | 'SECTOR_CONTROVERSIAL'
  // Documento
  | 'ASK_DOCUMENT'
  | 'DOCUMENT_UPLOADING'
  | 'DOCUMENT_ANALYZING'
  // Resultados da analise
  | 'RESULT_ELIGIBLE'
  | 'SHOW_TERMS'
  | 'TERMS_DECISION'
  | 'ASK_PIN'
  | 'VALIDATING_PIN'
  | 'ASK_LOGO'
  | 'LOGO_UPLOADING'
  | 'FLOW_COMPLETE_ELIGIBLE'
  // Contrato personalizado
  | 'RESULT_CUSTOM_CONTRACT'
  | 'ASK_CUSTOM_CONTRACT_DETAILS'
  | 'ASK_PIN_CUSTOM'
  | 'VALIDATING_PIN_CUSTOM'
  | 'ASK_LOGO_CUSTOM'
  | 'LOGO_UPLOADING_CUSTOM'
  | 'FLOW_COMPLETE_CUSTOM'
  // Nao elegivel
  | 'RESULT_NOT_ELIGIBLE'
  | 'ASK_SHARE_CONTACT'
  | 'FLOW_COMPLETE_NOT_ELIGIBLE'
  // Ambiguo
  | 'RESULT_AMBIGUOUS'
  | 'FLOW_COMPLETE_AMBIGUOUS'

// === Dados coletados ===

export interface EmpresaData {
  nomeEmpresa: string
  cnpj: string
  nomeResponsavel: string
  email: string
  cargo: string
  comoConheceu: string
  documentoPegada: FileAttachment
  logotipo: FileAttachment
  aceitouTermos: boolean
  pinConfirmado: boolean
  autorizouCompartilhamento: boolean | null
}

// === Estado global do chat ===

export interface ChatState {
  flowStep: FlowStep
  messages: ChatMessage[]
  composerMode: ComposerMode
  isAiTyping: boolean
  currentFile: FileAttachment | null
  collectedData: Partial<EmpresaData>
  error: string | null
}

// === Flow Events ===

export type FlowEvent =
  | { type: 'START_FLOW' }
  | { type: 'USER_TEXT'; value: string }
  | { type: 'QUICK_REPLY_SELECTED'; value: string; label: string; intent: QuickReplyIntent }
  | { type: 'FILE_SELECTED'; file: FileAttachment }
  | { type: 'FILE_SUBMITTED' }
  | { type: 'FILE_UPLOAD_COMPLETE' }
  | { type: 'FILE_UPLOAD_ERROR'; error: string }
  | { type: 'BACKEND_CNPJ_RESULT'; status: 'blocked' | 'recadastro' | 'new' }
  | { type: 'BACKEND_SECTOR_RESULT'; controversial: boolean }
  | { type: 'BACKEND_DOC_RESULT'; result: 'eligible' | 'custom_contract' | 'not_eligible' | 'ambiguous'; reason?: string }
  | { type: 'PIN_SUBMITTED'; code: string }
  | { type: 'PIN_VALID' }
  | { type: 'PIN_INVALID' }
  | { type: 'TIMER_EXPIRED' }
  // Internal actions dispatched by the AI simulator
  | { type: '_AI_TYPING_START' }
  | { type: '_AI_TYPING_END'; message: ChatMessage }
  | { type: '_SET_COMPOSER'; mode: ComposerMode }
  | { type: '_ENQUEUE_QUICK_REPLIES'; options: QuickReplyOption[] }
  | { type: '_AUTO_ADVANCE' }

// === Backend result types ===

export interface CNPJValidationResult {
  status: 'blocked' | 'recadastro' | 'new'
  currentStatus?: string
}

export interface SectorCheckResult {
  controversial: boolean
  sectorName?: string
}

export interface DocumentAnalysisResult {
  result: 'eligible' | 'custom_contract' | 'not_eligible' | 'ambiguous'
  reason?: string
  documentType?: string
}

export interface PinValidationResult {
  valid: boolean
}

export interface FileUploadResult {
  success: boolean
  url?: string
}
