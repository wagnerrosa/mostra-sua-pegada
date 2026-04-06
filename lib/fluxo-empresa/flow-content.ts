/**
 * Conteudo desacoplado do fluxo Empresa Participante.
 *
 * Fonte unica de texto: _refs/chat_example.md
 * Regra de ouro: nenhum texto da IA pode existir fora deste arquivo.
 */

import type { ComposerMode, FlowStep, QuickReplyOption } from '@/types/chat'

export interface StepContent {
  /** Mensagens IA a exibir sequencialmente (multiplas bolhas) */
  messages: string[]
  /** Modo do composer apos as mensagens serem exibidas */
  composerMode: ComposerMode
  /** Quick replies a exibir (se aplicavel) */
  quickReplies?: QuickReplyOption[]
}

const CNPJ_REGEX = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/

export const flowContent: Partial<Record<FlowStep, StepContent>> = {
  // === Boas-vindas ===
  WELCOME: {
    messages: [
      'Oi! Que bom ter você aqui 🌱',
      'A Nude criou o movimento **Mostra sua Pegada** para ajudar marcas a exibirem a pegada de carbono dos seus produtos com transparência.',
      'Vou te guiar rapidinho pelo cadastro — leva poucos minutos 🙂\n\nVamos começar?',
    ],
    composerMode: { type: 'text', placeholder: 'Digite sua resposta...' },
  },

  // === Coleta sequencial ===
  ASK_COMPANY_NAME: {
    messages: [
      'Pra começar, me conta:\n\nQual é o nome da sua empresa?',
    ],
    composerMode: { type: 'text', placeholder: 'Nome da empresa...' },
  },

  ASK_CNPJ: {
    messages: [
      'Perfeito! 👍\n\nE o CNPJ?',
    ],
    composerMode: {
      type: 'text',
      placeholder: 'XX.XXX.XXX/XXXX-XX',
      validation: CNPJ_REGEX,
    },
  },

  ASK_RESPONSAVEL_NOME: {
    messages: [
      'Agora só preciso de alguns dados seus 👇\n\nQual é o seu nome?',
    ],
    composerMode: { type: 'text', placeholder: 'Seu nome...' },
  },

  ASK_RESPONSAVEL_EMAIL: {
    messages: [
      'E o seu e-mail?',
    ],
    composerMode: { type: 'text', placeholder: 'seu@email.com' },
  },

  ASK_RESPONSAVEL_CARGO: {
    messages: [
      'Qual é o seu cargo na empresa?',
    ],
    composerMode: { type: 'text', placeholder: 'Seu cargo...' },
  },

  ASK_COMO_CONHECEU: {
    messages: [
      'E como você conheceu o movimento?',
    ],
    composerMode: { type: 'text', placeholder: 'Como conheceu...' },
  },

  // === Ramos de bloqueio / recadastro ===
  CNPJ_RECADASTRO: {
    messages: [
      'Encontrei um cadastro com esse CNPJ 👀',
      'Vamos atualizar seus dados — os anteriores serão substituídos.\n\nVamos lá!',
    ],
    composerMode: { type: 'loading', label: '' },
  },

  CNPJ_BLOCKED: {
    messages: [
      'Deixa eu te avisar 👀',
      'Encontrei um cadastro com esse CNPJ.\nPelo que vemos aqui, sua empresa já faz parte do movimento.',
      'Se quiser atualizar alguma informação ou tirar dúvidas, é só falar com a gente:\n📩 mari@heynude.com.br\n\nObrigado por fazer parte 💚',
    ],
    composerMode: { type: 'disabled', reason: 'Fluxo encerrado' },
  },

  SECTOR_CONTROVERSIAL: {
    messages: [
      'Obrigado por enviar! 🙏',
      'Identificamos que seu setor exige uma análise mais cuidadosa.',
      'Nossa equipe vai revisar e te retornar em breve por e-mail 📩',
    ],
    composerMode: { type: 'disabled', reason: 'Fluxo encerrado' },
  },

  // === Documento ===
  ASK_DOCUMENT: {
    messages: [
      'Tudo certo até aqui! 💚',
      'Agora precisamos do **documento de pegada de carbono** do seu produto.\n\nPode enviar por aqui:',
    ],
    composerMode: {
      type: 'file',
      accept: '.pdf',
      label: 'Pode enviar o documento por aqui.\n(Arraste ou clique para selecionar)',
    },
  },

  // === Resultado: Elegivel ===
  RESULT_ELIGIBLE: {
    messages: [
      'Parabéns! 🎉',
      'O documento foi validado com sucesso.\n\nSua empresa é elegível para participar do movimento **Mostra sua Pegada**!',
    ],
    composerMode: { type: 'loading', label: '' },
  },

  SHOW_TERMS: {
    messages: [
      'Agora só falta um passo importante:\n\nVocê pode revisar os termos de participação no movimento.',
      '__TERMS_BLOCK__',
      'Tudo certo por aí?',
    ],
    composerMode: { type: 'loading', label: '' },
  },

  TERMS_DECISION: {
    messages: [],
    composerMode: { type: 'quick-reply' },
    quickReplies: [
      { id: 'accept', label: 'Aceito os termos', value: 'accept', intent: 'confirm' },
      { id: 'reject', label: 'Não aceito os termos', value: 'reject', intent: 'reject' },
    ],
  },

  ASK_PIN: {
    messages: [
      'Boa! 👌',
      'Te enviamos um código por e-mail para confirmar seus dados.\n\nPode digitar aqui:',
    ],
    composerMode: { type: 'pin', length: 6 },
  },

  ASK_LOGO: {
    messages: [
      'Pronto! 💚',
      'Sua empresa agora faz parte do movimento **Mostra sua Pegada**.',
      'Agora só falta o seu logotipo para a gente seguir com os próximos passos.\n\nEnvie o logo da sua empresa:',
    ],
    composerMode: {
      type: 'file',
      accept: 'image/png,image/jpeg,.pdf,.ai',
      label: 'Arraste ou clique para selecionar\n(PNG ou JPG)',
    },
  },

  FLOW_COMPLETE_ELIGIBLE: {
    messages: [
      'Perfeito! 🚀',
      'Recebemos tudo por aqui.\nAgora seguimos com os próximos passos e você será avisado por e-mail.',
      'Obrigado por fazer parte desse movimento com a gente 💚',
    ],
    composerMode: { type: 'disabled', reason: 'Cadastro finalizado' },
  },

  // === Resultado: Contrato personalizado ===
  RESULT_CUSTOM_CONTRACT: {
    messages: [
      'Ótimo! 🎉',
      'Seu documento foi validado. Você é elegível para o movimento!',
      'Vimos que pode ser necessário um contrato personalizado para sua empresa.\n\nDescreva sua solicitação abaixo (pode anexar um arquivo se necessário):',
    ],
    composerMode: {
      type: 'text-long',
      placeholder: 'Descreva sua solicitação...',
      maxLength: 2000,
    },
  },

  ASK_CUSTOM_CONTRACT_DETAILS: {
    messages: [],
    composerMode: {
      type: 'text-long',
      placeholder: 'Descreva sua solicitação...',
      maxLength: 2000,
    },
  },

  ASK_PIN_CUSTOM: {
    messages: [
      'Boa! 👌',
      'Te enviamos um código por e-mail para confirmar.\n\nPode digitar aqui:',
    ],
    composerMode: { type: 'pin', length: 6 },
  },

  ASK_LOGO_CUSTOM: {
    messages: [
      'Agora envie o logotipo da sua empresa:',
    ],
    composerMode: {
      type: 'file',
      accept: 'image/png,image/jpeg,.pdf,.ai',
      label: 'Arraste ou clique para selecionar\n(PNG ou JPG)',
    },
  },

  FLOW_COMPLETE_CUSTOM: {
    messages: [
      'Perfeito! 🚀',
      'Recebemos sua solicitação de contrato personalizado.\nNossa equipe vai entrar em contato em breve.',
      'Obrigado por fazer parte desse movimento com a gente 💚',
    ],
    composerMode: { type: 'disabled', reason: 'Solicitação enviada' },
  },

  // === Resultado: Nao elegivel ===
  RESULT_NOT_ELIGIBLE: {
    messages: [
      'Hmm, tive dificuldade em validar esse documento 😕',
      'O documento enviado não corresponde a uma **pegada de carbono de produto** conforme a norma ISO 14067.',
      'Mas sem problema — temos consultorias parceiras que podem te ajudar:\n\n• **Planton** (parceira oficial)\n• Outras consultorias certificadas',
      'Você autoriza que compartilhemos seus dados de contato com uma consultoria parceira?',
    ],
    composerMode: { type: 'loading', label: '' },
  },

  ASK_SHARE_CONTACT: {
    messages: [],
    composerMode: { type: 'quick-reply' },
    quickReplies: [
      { id: 'share-yes', label: 'Sim, autorizo', value: 'yes', intent: 'confirm' },
      { id: 'share-no', label: 'Não, obrigado', value: 'no', intent: 'reject' },
    ],
  },

  FLOW_COMPLETE_NOT_ELIGIBLE: {
    messages: [
      'Tudo bem! Registramos sua resposta.',
      'Se precisar de algo no futuro, estamos por aqui.\n\nObrigado pelo interesse no movimento 💚',
    ],
    composerMode: { type: 'disabled', reason: 'Fluxo encerrado' },
  },

  // === Resultado: Ambiguo ===
  RESULT_AMBIGUOUS: {
    messages: [
      'Hmm, não consegui analisar completamente esse documento 🤔',
      'Vou encaminhar para nossa equipe fazer uma avaliação manual.',
      'Você receberá um retorno por e-mail em breve.\n📩 mari@heynude.com.br\n\nObrigado pela paciência 💚',
    ],
    composerMode: { type: 'disabled', reason: 'Aguardando revisão manual' },
  },

  FLOW_COMPLETE_AMBIGUOUS: {
    messages: [],
    composerMode: { type: 'disabled', reason: 'Aguardando revisão manual' },
  },
}
