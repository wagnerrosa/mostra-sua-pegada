/**
 * Simulador de IA conversacional.
 *
 * Responsavel por:
 * - Delay entre mensagens (simula "digitando")
 * - Sequencia de multiplas bolhas com pausa entre elas
 * - Simulacao de delays de upload e analise
 */

import type { ChatMessage, FlowEvent } from '@/types/chat'
import { createMessage } from './state-machine'
import type { StepContent } from './flow-content'

export interface AISimulatorConfig {
  typingDelayMs: { min: number; max: number }
  betweenMessagesMs: { min: number; max: number }
  analysisDelayMs: { min: number; max: number }
  uploadSimMs: { min: number; max: number }
}

export const defaultConfig: AISimulatorConfig = {
  typingDelayMs: { min: 500, max: 1200 },
  betweenMessagesMs: { min: 300, max: 600 },
  analysisDelayMs: { min: 2000, max: 4000 },
  uploadSimMs: { min: 1500, max: 3000 },
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Enfileira mensagens da IA com delays realistas.
 *
 * Sequencia para um step com messages: ['msg1', 'msg2', 'msg3']:
 * 1. Dispatch _AI_TYPING_START (mostra indicador "digitando")
 * 2. Aguarda typingDelay
 * 3. Dispatch _AI_TYPING_END com msg1 (remove indicador, adiciona bolha)
 * 4. Aguarda betweenMessages
 * 5. Repete para msg2, msg3
 * 6. Dispatch _SET_COMPOSER com o modo final
 * 7. Se houver quick replies, dispatch _ENQUEUE_QUICK_REPLIES
 */
export async function simulateAIResponse(
  content: StepContent,
  dispatch: (event: FlowEvent) => void,
  config: AISimulatorConfig = defaultConfig,
  signal?: AbortSignal,
): Promise<void> {
  const { messages, composerMode, quickReplies } = content

  // Lock composer during AI sequence
  dispatch({ type: '_SET_COMPOSER', mode: { type: 'loading', label: '' } })

  for (let i = 0; i < messages.length; i++) {
    if (signal?.aborted) return

    // Show typing indicator
    dispatch({ type: '_AI_TYPING_START' })

    // Wait for typing delay
    const typingDelay = randomBetween(config.typingDelayMs.min, config.typingDelayMs.max)
    await delay(typingDelay)

    if (signal?.aborted) return

    // Create the AI message
    const message: ChatMessage = createMessage({
      role: 'ai',
      type: 'text',
      content: messages[i],
    })

    // Replace typing indicator with the actual message
    dispatch({ type: '_AI_TYPING_END', message })

    // Pause between messages (except after the last one)
    if (i < messages.length - 1) {
      const betweenDelay = randomBetween(
        config.betweenMessagesMs.min,
        config.betweenMessagesMs.max
      )
      await delay(betweenDelay)
    }
  }

  if (signal?.aborted) return

  // Set final composer mode
  dispatch({ type: '_SET_COMPOSER', mode: composerMode })

  // Enqueue quick replies if present
  if (quickReplies && quickReplies.length > 0) {
    dispatch({ type: '_ENQUEUE_QUICK_REPLIES', options: quickReplies })
  }
}

/**
 * Simula delay de upload de arquivo.
 */
export async function simulateUploadDelay(
  config: AISimulatorConfig = defaultConfig,
): Promise<void> {
  const ms = randomBetween(config.uploadSimMs.min, config.uploadSimMs.max)
  await delay(ms)
}

/**
 * Simula delay de analise de documento.
 */
export async function simulateAnalysisDelay(
  config: AISimulatorConfig = defaultConfig,
): Promise<void> {
  const ms = randomBetween(config.analysisDelayMs.min, config.analysisDelayMs.max)
  await delay(ms)
}
