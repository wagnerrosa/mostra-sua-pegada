import { chatReducer, initialState } from '../state-machine'
import type { FlowEvent } from '@/types/chat'

describe('Fase 1: PRE_CHAT → WELCOME flow', () => {
  test('should start in PRE_CHAT state', () => {
    expect(initialState.flowStep).toBe('PRE_CHAT')
    expect(initialState.messages).toEqual([])
    expect(initialState.isAiTyping).toBe(false)
  })

  test('PRE_CHAT → WELCOME on USER_TEXT', () => {
    const event: FlowEvent = { type: 'USER_TEXT', value: 'teste' }
    const newState = chatReducer(initialState, event)

    expect(newState.flowStep).toBe('WELCOME')
    expect(newState.messages).toHaveLength(1)
    expect(newState.messages[0].content).toBe('teste')
    expect(newState.messages[0].role).toBe('user')
  })

  test('PRE_CHAT → WELCOME on QUICK_REPLY_SELECTED', () => {
    const event: FlowEvent = {
      type: 'QUICK_REPLY_SELECTED',
      value: 'register',
      label: 'Cadastrar minha empresa',
      intent: 'action',
    }
    const newState = chatReducer(initialState, event)

    expect(newState.flowStep).toBe('WELCOME')
    expect(newState.messages).toHaveLength(1)
    expect(newState.messages[0].content).toBe('Cadastrar minha empresa')
    expect(newState.messages[0].type).toBe('quick-reply-answer')
  })

  test('PRE_CHAT stays on other events', () => {
    const event: FlowEvent = { type: 'START_FLOW' }
    const newState = chatReducer(initialState, event)

    expect(newState.flowStep).toBe('PRE_CHAT')
  })

  test('WELCOME → ASK_COMPANY_NAME on START_FLOW', () => {
    // First transition: PRE_CHAT → WELCOME via user text
    const preChatEvent: FlowEvent = { type: 'USER_TEXT', value: 'Olá' }
    const welcomeState = chatReducer(initialState, preChatEvent)
    expect(welcomeState.flowStep).toBe('WELCOME')

    // Second transition: WELCOME → ASK_COMPANY_NAME via START_FLOW
    const startFlowEvent: FlowEvent = { type: 'START_FLOW' }
    const askCompanyState = chatReducer(welcomeState, startFlowEvent)
    expect(askCompanyState.flowStep).toBe('ASK_COMPANY_NAME')
  })
})
