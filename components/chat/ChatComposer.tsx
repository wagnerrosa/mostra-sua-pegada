'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { ComposerMode } from '@/types/chat'

// ─── Icons ──────────────────────────────────────────────────────────────────
// Extracted & normalized from _refs/ChatComposer_Botoes.svg
// All icons rendered inside a 44×44 circle button

/** Send / arrow icon — play-button shape pointing right */
function SendIcon({ active }: { active?: boolean }) {
  // Circle: white bg + black border (idle) or green bg + black border (active)
  const circleFill = active ? 'var(--color-green)' : 'white'
  // Arrow path: filled shape + stroke outline (from SVG: M-14.3,-14.7 L-9.8,0 L-14.3,14.7 L14.3,0 Z + line)
  // Normalized to 44×44 viewBox, arrow centered at 22,22
  const arrowFill = active ? 'white' : '#EAE0CA'
  const arrowStroke = active ? '#3E5235' : 'black'
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="21.5" fill={circleFill} stroke="black" strokeWidth="1" />
      <path
        d="M8.7 8.42L13.06 22L8.7 35.58L36.7 22L8.7 8.42Z"
        fill={arrowFill}
        stroke={arrowStroke}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <line x1="13.06" y1="22" x2="36.7" y2="22" stroke={arrowStroke} strokeWidth="1.2" />
    </svg>
  )
}

/** Clip / paperclip icon */
function ClipIcon({ active }: { active?: boolean }) {
  const circleFill = active ? 'var(--color-green)' : 'white'
  const pathStroke = active ? 'white' : 'black'
  // Normalized clip path from SVG (circle at cx=360, cy=392, r=43)
  // Original path relative offsets normalized to 44×44
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="22" r="21.5" fill={circleFill} stroke="black" strokeWidth="1" />
      <path
        d="M29.8 18.5L17.9 30.4C16.5 31.8 14.2 31.8 12.8 30.4C11.4 29 11.4 26.7 12.8 25.3L24.7 13.4C25.6 12.5 27 12.5 27.9 13.4C28.8 14.3 28.8 15.7 27.9 16.6L16.1 28.4C15.7 28.8 15 28.8 14.6 28.4C14.2 28 14.2 27.3 14.6 26.9L26.4 15.1"
        stroke={pathStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Spinner / loading icon */
function SpinnerIcon() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <circle cx="22" cy="22" r="21.5" fill="var(--color-blue)" stroke="black" strokeWidth="1" />
      <path
        d="M10.2 17C11.8 11.2 17.7 7.8 23.6 9.4C29.5 11 32.9 16.9 31.3 22.7M10.2 17C7.1 28.4 13.8 40 25.4 43.2C37 46.4 48.7 39.7"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ─── Composer ───────────────────────────────────────────────────────────────

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
    const file = e.dataTransfer.files?.[0]
    if (file) onSelectFile(file)
  }, [onSelectFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  // ─── Shared styles ───────────────────────────────────────────────────────

  /** Outer wrapper: same horizontal padding as MessageList (24px) */
  const wrapperStyle: React.CSSProperties = {
    borderTop: '1px solid var(--color-border)',
    padding: '12px 24px 16px',
    backgroundColor: 'var(--color-surface)',
  }

  /** Pill container — matches Figma proportions */
  const pillStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    backgroundColor: 'var(--color-bg)',
    borderRadius: '32px',
    padding: '4px 4px 4px 20px',
    minHeight: '52px',
  }

  /** Base input style */
  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontFamily: 'var(--font-text)',
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--color-black)',
  }

  // ─── Mode renderers ──────────────────────────────────────────────────────

  if (mode.type === 'disabled') {
    return (
      <div style={wrapperStyle}>
        <div style={pillStyle}>
          <input type="text" disabled placeholder={mode.reason}
            style={{ ...inputStyle, opacity: 0.45 }} />
          <SendIcon />
        </div>
      </div>
    )
  }

  if (mode.type === 'loading') {
    return (
      <div style={wrapperStyle}>
        <div style={pillStyle}>
          <input type="text" disabled placeholder={mode.label || 'Processando...'}
            style={{ ...inputStyle, opacity: 0.45 }} />
          <SpinnerIcon />
        </div>
      </div>
    )
  }

  if (mode.type === 'quick-reply') {
    return (
      <div style={wrapperStyle}>
        <div style={pillStyle}>
          <input type="text" disabled placeholder="Selecione uma opção acima"
            style={{ ...inputStyle, opacity: 0.45 }} />
          <SendIcon />
        </div>
      </div>
    )
  }

  if (mode.type === 'text') {
    const canSend = text.trim().length > 0
    return (
      <div style={wrapperStyle}>
        <div style={pillStyle}>
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode.placeholder}
            style={inputStyle}
          />
          <button
            onClick={handleTextSubmit}
            disabled={!canSend}
            style={{ background: 'none', border: 'none', padding: 0, cursor: canSend ? 'pointer' : 'default', opacity: canSend ? 1 : 0.45 }}
            aria-label="Enviar mensagem"
          >
            <SendIcon active={canSend} />
          </button>
        </div>
      </div>
    )
  }

  if (mode.type === 'text-long') {
    const canSend = text.trim().length > 0
    return (
      <div style={wrapperStyle}>
        <div style={{ ...pillStyle, alignItems: 'flex-end', padding: '10px 4px 10px 20px' }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode.placeholder}
            maxLength={mode.maxLength}
            rows={3}
            style={{ ...inputStyle, resize: 'none', maxHeight: '120px', overflowY: 'auto' }}
          />
          <button
            onClick={handleTextSubmit}
            disabled={!canSend}
            style={{ background: 'none', border: 'none', padding: '0 0 2px', cursor: canSend ? 'pointer' : 'default', opacity: canSend ? 1 : 0.45 }}
            aria-label="Enviar mensagem"
          >
            <SendIcon active={canSend} />
          </button>
        </div>
      </div>
    )
  }

  if (mode.type === 'file') {
    return (
      <div style={wrapperStyle}>
        <div
          style={{ ...pillStyle, cursor: 'pointer' }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Selecionar arquivo"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={mode.accept}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <span style={{ ...inputStyle, opacity: 0.6, whiteSpace: 'pre-line' }}>
            {mode.label}
          </span>
          <div style={{ flexShrink: 0 }}>
            <ClipIcon />
          </div>
        </div>
      </div>
    )
  }

  if (mode.type === 'file-preview') {
    return (
      <div style={wrapperStyle}>
        <div style={pillStyle}>
          <span style={{ ...inputStyle }}>
            {mode.file.name} anexado. Clique para enviar
          </span>
          <button
            onClick={onSubmitFile}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            aria-label="Enviar arquivo"
          >
            <ClipIcon active />
          </button>
        </div>
      </div>
    )
  }

  if (mode.type === 'pin') {
    const canSend = pinValue.length === mode.length
    return (
      <div style={wrapperStyle}>
        <div style={pillStyle}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={mode.length}
            value={pinValue}
            onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ''))}
            onKeyDown={handleKeyDown}
            placeholder={`Código de ${mode.length} dígitos`}
            style={{ ...inputStyle, letterSpacing: '6px', fontSize: '18px' }}
          />
          <button
            onClick={handlePinSubmit}
            disabled={!canSend}
            style={{ background: 'none', border: 'none', padding: 0, cursor: canSend ? 'pointer' : 'default', opacity: canSend ? 1 : 0.45 }}
            aria-label="Confirmar código"
          >
            <SendIcon active={canSend} />
          </button>
        </div>
      </div>
    )
  }

  return null
}
