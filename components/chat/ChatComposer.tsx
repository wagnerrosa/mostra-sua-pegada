'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { ComposerMode } from '@/types/chat'

// ─── Icons ──────────────────────────────────────────────────────────────────

function IconSend({ active }: { active?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={active ? '/btn/send-active.svg' : '/btn/send-idle.svg'}
      width={65} height={65}
      alt=""
      aria-hidden="true"
    />
  )
}

function IconClip({ active }: { active?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={active ? '/btn/clip-active.svg' : '/btn/clip-idle.svg'}
      width={65} height={65}
      alt=""
      aria-hidden="true"
    />
  )
}

function IconSpinner() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/btn/spinner.svg"
      width={65} height={65}
      alt=""
      aria-hidden="true"
      style={{ animation: 'spin 1s linear infinite' }}
    />
  )
}

// ─── Pill layout ─────────────────────────────────────────────────────────────
// The composer is a rounded pill: left text area + right circle button
// Button sits inside the pill with 4px gap from right/top/bottom edges

interface PillProps {
  inputSlot: React.ReactNode
  buttonSlot: React.ReactNode
  onClick?: () => void
  onDrop?: (e: React.DragEvent) => void
  onDragOver?: (e: React.DragEvent) => void
  onDragLeave?: () => void
  highlight?: boolean
}

function Pill({ inputSlot, buttonSlot, onClick, onDrop, onDragOver, onDragLeave, highlight }: PillProps) {
  return (
    <div
      className="pill-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: highlight ? 'rgba(169, 200, 188, 0.25)' : 'rgba(239, 228, 206, 0.6)',
        border: highlight ? '2px dashed var(--color-green)' : '1px solid rgba(0, 0, 0, 0.2)',
        borderRadius: '99px',
        padding: '14px 14px 14px 26px',
        minHeight: '77px',
        gap: '8px',
        cursor: onClick ? 'pointer' : undefined,
        transition: 'background-color 0.15s, border 0.15s',
      }}
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <div style={{ flex: 1 }}>{inputSlot}</div>
      <div className="icon-btn" style={{ flexShrink: 0 }}>{buttonSlot}</div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontFamily: 'var(--font-text)',
  fontSize: 'var(--composer-input-font-size, 18px)',
  lineHeight: 'var(--composer-input-line-height, 1.45)',
  color: 'var(--color-black)',
}

const wrapperStyle: React.CSSProperties = {
  borderTop: 'none',
  padding: '10px 24px 16px',
  paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))',
  backgroundColor: 'var(--color-surface)',
}

const wrapperClass = 'composer-wrapper'

// ─── Main component ──────────────────────────────────────────────────────────

interface ChatComposerProps {
  mode: ComposerMode
  onSendText: (text: string) => void
  onSelectFile: (file: File) => void
  onSubmitFile: () => void
  onSubmitPin: (code: string) => void
  focusTrigger?: number
}

export default function ChatComposer({
  mode,
  onSendText,
  onSelectFile,
  onSubmitFile,
  onSubmitPin,
  focusTrigger,
}: ChatComposerProps) {
  const [text, setText] = useState('')
  const [pinValue, setPinValue] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isTouchPrimaryInput = () => window.matchMedia('(hover: none)').matches

  useEffect(() => {
    setText('')
    setPinValue('')
    setFileError(null)
  }, [mode.type])

  useEffect(() => {
    if (isTouchPrimaryInput()) return
    if (mode.type === 'text' && inputRef.current) inputRef.current.focus()
    else if (mode.type === 'text-long' && textareaRef.current) textareaRef.current.focus()
    else if (mode.type === 'pin' && inputRef.current) inputRef.current.focus()
  }, [mode.type])

  useEffect(() => {
    if (focusTrigger === undefined) return
    // On touch devices, skip autofocus on chat entry to avoid keyboard jank/jump.
    if (isTouchPrimaryInput()) return
    requestAnimationFrame(() => {
      if (mode.type === 'text-long') textareaRef.current?.focus()
      else if (mode.type === 'text' || mode.type === 'pin') inputRef.current?.focus()
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusTrigger])

  const handleTextSubmit = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed) return
    if (mode.type === 'text' && mode.validation && !mode.validation.test(trimmed)) return
    onSendText(trimmed)
    setText('')
  }, [text, mode, onSendText])

  const handlePinSubmit = useCallback(() => {
    if (mode.type !== 'pin') return
    if (pinValue.length !== mode.length) return
    onSubmitPin(pinValue)
    setPinValue('')
  }, [pinValue, mode, onSubmitPin])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (mode.type === 'text' || mode.type === 'text-long') handleTextSubmit()
      else if (mode.type === 'pin') handlePinSubmit()
    }
  }, [handleTextSubmit, handlePinSubmit, mode.type])

  const validateAndSelectFile = useCallback((file: File, accept?: string) => {
    if (accept) {
      const accepted = accept.split(',').map((a) => a.trim())
      const isValid = accepted.some((a) => {
        if (a.startsWith('.')) return file.name.toLowerCase().endsWith(a.toLowerCase())
        if (a.endsWith('/*')) return file.type.startsWith(a.slice(0, -2))
        return file.type === a
      })
      if (!isValid) {
        setFileError(`Tipo de arquivo não suportado. Use: ${accept}`)
        setTimeout(() => setFileError(null), 4000)
        return
      }
    }
    setFileError(null)
    onSelectFile(file)
  }, [onSelectFile])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const accept = mode.type === 'file' ? mode.accept : undefined
    if (file) validateAndSelectFile(file, accept)
    e.target.value = ''
  }, [validateAndSelectFile, mode])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    const accept = mode.type === 'file' ? mode.accept : undefined
    if (file) validateAndSelectFile(file, accept)
  }, [validateAndSelectFile, mode])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  // ─── Modes ────────────────────────────────────────────────────────────────

  if (mode.type === 'disabled') {
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <Pill
          inputSlot={<input className="composer-input" disabled value="" placeholder={mode.reason} style={{ ...inputStyle, opacity: 0.6 }} readOnly />}
          buttonSlot={<div style={{ opacity: 0.4 }}><IconSend /></div>}
        />
      </div>
    )
  }

  if (mode.type === 'loading') {
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <Pill
          inputSlot={<input className="composer-input" disabled value="" placeholder={mode.label || 'Processando...'} style={{ ...inputStyle, opacity: 0.6 }} readOnly />}
          buttonSlot={<IconSpinner />}
        />
      </div>
    )
  }

  if (mode.type === 'quick-reply') {
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <Pill
          inputSlot={<input className="composer-input" disabled value="" placeholder="Selecione uma opção acima" style={{ ...inputStyle, opacity: 0.8 }} readOnly />}
          buttonSlot={<div style={{ opacity: 0.4 }}><IconSend /></div>}
        />
      </div>
    )
  }

  if (mode.type === 'text') {
    const canSend = text.trim().length > 0
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <Pill
          inputSlot={
            <input
              ref={inputRef}
              type="text"
              className="composer-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={mode.placeholder}
              style={inputStyle}
            />
          }
          buttonSlot={
            <button
              onClick={(e) => { e.stopPropagation(); handleTextSubmit() }}
              disabled={!canSend}
              style={{ background: 'none', border: 'none', padding: 0, cursor: canSend ? 'pointer' : 'default', display: 'flex', opacity: canSend ? 1 : 0.45 }}
              aria-label="Enviar mensagem"
            >
              <IconSend active={canSend} />
            </button>
          }
        />
      </div>
    )
  }

  if (mode.type === 'text-long') {
    const canSend = text.trim().length > 0
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            backgroundColor: 'var(--color-bg)',
            borderRadius: '20px',
            padding: '12px 6px 12px 22px',
            gap: '8px',
          }}
        >
          <textarea
            ref={textareaRef}
            className="composer-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode.placeholder}
            maxLength={mode.maxLength}
            rows={3}
            style={{ ...inputStyle, flex: 1, resize: 'none', maxHeight: '120px', overflowY: 'auto' }}
          />
          <button
            onClick={handleTextSubmit}
            disabled={!canSend}
            style={{ background: 'none', border: 'none', padding: '0 0 2px', cursor: canSend ? 'pointer' : 'default', display: 'flex', opacity: canSend ? 1 : 0.45 }}
            aria-label="Enviar mensagem"
          >
            <IconSend active={canSend} />
          </button>
        </div>
      </div>
    )
  }

  if (mode.type === 'file') {
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <input
          ref={fileInputRef}
          type="file"
          accept={mode.accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
        {fileError && (
          <p
            role="alert"
            style={{
              fontFamily: 'var(--font-text)',
              fontSize: '12px',
              color: 'var(--color-brown)',
              margin: '0 0 6px 26px',
              fontWeight: 700,
            }}
          >
            {fileError}
          </p>
        )}
        <Pill
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          highlight={isDragOver}
          inputSlot={
            <span style={{ ...inputStyle, opacity: 0.55, cursor: 'pointer', whiteSpace: 'pre-line', display: 'block' }}>
              {isDragOver ? 'Solte o arquivo aqui...' : mode.label}
            </span>
          }
          buttonSlot={
            <button
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
              aria-label="Selecionar arquivo"
            >
              <IconClip />
            </button>
          }
        />
      </div>
    )
  }

  if (mode.type === 'file-preview') {
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <Pill
          inputSlot={
            <span style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', minWidth: 0 }}>
              <span
                style={{
                  minWidth: 0,
                  maxWidth: 'min(48vw, 320px)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={mode.file.name}
              >
                {mode.file.name}
              </span>
              <span>anexado.</span>
              <span style={{ opacity: 0.8, fontWeight: 700 }}>Clique para enviar</span>
            </span>
          }
          buttonSlot={
            <button
              onClick={onSubmitFile}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
              aria-label="Enviar arquivo"
            >
              <IconClip active />
            </button>
          }
        />
      </div>
    )
  }

  if (mode.type === 'pin') {
    const canSend = pinValue.length === mode.length
    return (
      <div className={wrapperClass} style={wrapperStyle}>
        <Pill
          inputSlot={
            <input
              ref={inputRef}
              type="text"
              className="composer-input"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={mode.length}
              value={pinValue}
              onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ''))}
              onKeyDown={handleKeyDown}
              placeholder={`CÓDIGO DE ${mode.length} DÍGITOS`}
              style={{ ...inputStyle, letterSpacing: '6px', fontSize: '14px' }}
            />
          }
          buttonSlot={
            <button
              onClick={(e) => { e.stopPropagation(); handlePinSubmit() }}
              disabled={!canSend}
              style={{ background: 'none', border: 'none', padding: 0, cursor: canSend ? 'pointer' : 'default', display: 'flex', opacity: canSend ? 1 : 0.45 }}
              aria-label="Confirmar código"
            >
              <IconSend active={canSend} />
            </button>
          }
        />
      </div>
    )
  }

  return null
}
