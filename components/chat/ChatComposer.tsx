'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { ComposerMode } from '@/types/chat'

// ─── Icons ──────────────────────────────────────────────────────────────────
// Faithfully normalized from _refs/ChatComposer_Botoes.svg
// All drawn in a 44×44 viewBox.

/** Send arrow — play-button shape pointing right.
 *  idle: white circle + 20%-black border; active: green circle + dark outline */
function IconSend({ active }: { active?: boolean }) {
  return (
    <svg width="65" height="65" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle
        cx="22" cy="22" r="21.5"
        fill={active ? 'var(--color-green)' : 'white'}
        stroke="rgba(0,0,0,0.2)" strokeWidth="1"
      />
      {/* Arrow body fill */}
      <path
        d="M14.67 14.47L16.98 22L14.67 29.53L29.33 22Z"
        fill={active ? 'white' : 'var(--color-bg)'}
      />
      {/* Arrow outline + shaft */}
      <path
        d="M16.98 22L14.67 14.47L29.33 22M16.98 22L14.67 29.53L29.33 22M16.98 22H29.33"
        stroke={active ? 'rgba(62,82,53,0.6)' : 'rgba(0,0,0,0.4)'}
        strokeWidth="1.1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Paperclip icon.
 *  idle: white circle + 20%-black border; active (file attached): green circle */
function IconClip({ active }: { active?: boolean }) {
  return (
    <svg width="65" height="65" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle
        cx="22" cy="22" r="21.5"
        fill={active ? 'var(--color-green)' : 'white'}
        stroke="rgba(0,0,0,0.2)" strokeWidth="1"
      />
      <path
        d="M30.017 21.216L22.436 28.796C21.508 29.725 20.248 30.246 18.935 30.246C17.621 30.246 16.362 29.725 15.433 28.796C14.505 27.867 13.983 26.608 13.983 25.294C13.983 23.981 14.505 22.721 15.433 21.793L22.502 14.724C23.121 14.104 23.962 13.755 24.838 13.754C25.714 13.753 26.556 14.1 27.176 14.72C27.796 15.339 28.145 16.179 28.145 17.055C28.146 17.932 27.799 18.772 27.18 19.392L20.094 26.462C19.784 26.771 19.365 26.945 18.927 26.945C18.489 26.945 18.069 26.771 17.76 26.462C17.45 26.152 17.276 25.732 17.276 25.294C17.276 24.857 17.45 24.437 17.76 24.127L24.763 17.132"
        stroke={active ? 'white' : 'rgba(0,0,0,0.5)'}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Spinner — blue circle with white arc */
function IconSpinner() {
  return (
    <svg
      width="65" height="65" viewBox="0 0 44 44" fill="none" aria-hidden="true"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <circle
        cx="22" cy="22" r="21.5"
        fill="var(--color-blue)" stroke="rgba(0,0,0,0.2)" strokeWidth="1"
      />
      <path
        d="M12.322 19.407C13.033 16.755 15.72 15.241 18.43 15.968C21.14 16.694 22.711 19.348 22 22.001"
        stroke="white" strokeWidth="1.6" strokeLinecap="round"
      />
    </svg>
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
      <div style={{ flexShrink: 0 }}>{buttonSlot}</div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontFamily: 'var(--font-text)',
  fontSize: '14px',
  lineHeight: '1.6',
  color: 'var(--color-black)',
}

const wrapperStyle: React.CSSProperties = {
  borderTop: 'none',
  padding: '10px 24px 16px',
  backgroundColor: 'var(--color-surface)',
}

// ─── Main component ──────────────────────────────────────────────────────────

interface ChatComposerProps {
  mode: ComposerMode
  onSendText: (text: string) => void
  onSelectFile: (file: File) => void
  onSubmitFile: () => void
  onSubmitPin: (code: string) => void
}

export default function ChatComposer({
  mode,
  onSendText,
  onSelectFile,
  onSubmitFile,
  onSubmitPin,
}: ChatComposerProps) {
  const [text, setText] = useState('')
  const [pinValue, setPinValue] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setText('')
    setPinValue('')
  }, [mode.type])

  useEffect(() => {
    if (mode.type === 'text' && inputRef.current) inputRef.current.focus()
    else if (mode.type === 'text-long' && textareaRef.current) textareaRef.current.focus()
    else if (mode.type === 'pin' && inputRef.current) inputRef.current.focus()
  }, [mode.type])

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

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onSelectFile(file)
    e.target.value = ''
  }, [onSelectFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onSelectFile(file)
  }, [onSelectFile])

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
      <div style={wrapperStyle}>
        <Pill
          inputSlot={<input className="composer-input" disabled value="" placeholder={mode.reason} style={{ ...inputStyle, opacity: 0.4 }} readOnly />}
          buttonSlot={<div style={{ opacity: 0.4 }}><IconSend /></div>}
        />
      </div>
    )
  }

  if (mode.type === 'loading') {
    return (
      <div style={wrapperStyle}>
        <Pill
          inputSlot={<input className="composer-input" disabled value="" placeholder={mode.label || 'Processando...'} style={{ ...inputStyle, opacity: 0.4 }} readOnly />}
          buttonSlot={<IconSpinner />}
        />
      </div>
    )
  }

  if (mode.type === 'quick-reply') {
    return (
      <div style={wrapperStyle}>
        <Pill
          inputSlot={<input className="composer-input" disabled value="" placeholder="Selecione uma opção acima" style={{ ...inputStyle, opacity: 0.4 }} readOnly />}
          buttonSlot={<div style={{ opacity: 0.4 }}><IconSend /></div>}
        />
      </div>
    )
  }

  if (mode.type === 'text') {
    const canSend = text.trim().length > 0
    return (
      <div style={wrapperStyle}>
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
      <div style={wrapperStyle}>
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
      <div style={wrapperStyle}>
        <input
          ref={fileInputRef}
          type="file"
          accept={mode.accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
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
      <div style={wrapperStyle}>
        <Pill
          inputSlot={
            <span style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{mode.file.name}</span>
              <span style={{ opacity: 0.5 }}>anexado. Clique para enviar</span>
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
      <div style={wrapperStyle}>
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
              placeholder={`Código de ${mode.length} dígitos`}
              style={{ ...inputStyle, letterSpacing: '6px', fontSize: '18px' }}
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
