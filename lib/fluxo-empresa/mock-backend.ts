/**
 * Mock backend para simulacao do fluxo empresa.
 *
 * Todos os metodos retornam Promises com delay artificial.
 * Cenarios podem ser forcados via query params:
 *   ?cnpj=blocked     → CNPJ retorna bloqueado
 *   ?sector=controversial → Setor controverso
 *   ?doc=eligible      → Documento elegivel (padrao)
 *   ?doc=not_eligible  → Documento nao elegivel
 *   ?doc=ambiguous     → Documento ambiguo
 *   ?doc=custom        → Contrato personalizado
 *   ?pin=invalid       → PIN sempre invalido
 */

import type {
  CNPJValidationResult,
  SectorCheckResult,
  DocumentAnalysisResult,
  PinValidationResult,
  FileUploadResult,
} from '@/types/chat'

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getQueryParam(key: string): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get(key)
}

// === CNPJ Validation ===

export async function validateCNPJ(_cnpj: string): Promise<CNPJValidationResult> {
  await delay(randomBetween(800, 1500))

  const override = getQueryParam('cnpj')
  if (override === 'blocked') {
    return { status: 'blocked', currentStatus: 'Cadastrado' }
  }
  if (override === 'recadastro') {
    return { status: 'recadastro' }
  }

  // Default: CNPJ novo
  return { status: 'new' }
}

// === Sector Check ===

export async function checkSector(
  _cnpj: string,
  _companyName: string,
): Promise<SectorCheckResult> {
  await delay(randomBetween(600, 1200))

  const override = getQueryParam('sector')
  if (override === 'controversial') {
    return { controversial: true, sectorName: 'Tabaco' }
  }

  return { controversial: false, sectorName: 'Alimentos' }
}

// === Document Analysis ===

export async function analyzeDocument(
  _fileName: string,
): Promise<DocumentAnalysisResult> {
  await delay(randomBetween(2000, 4000))

  const override = getQueryParam('doc')
  switch (override) {
    case 'not_eligible':
      return {
        result: 'not_eligible',
        reason: 'Documento enviado é um inventário de emissões GHG, não uma pegada de carbono de produto (ISO 14067).',
        documentType: 'inventario_ghg',
      }
    case 'ambiguous':
      return {
        result: 'ambiguous',
        reason: 'Documento ilegível ou formato não reconhecido.',
      }
    case 'custom':
      return {
        result: 'custom_contract',
        reason: 'Empresa necessita contrato personalizado.',
      }
    case 'eligible':
    default:
      return {
        result: 'eligible',
        documentType: 'pegada_carbono_iso14067',
      }
  }
}

// === PIN Validation ===

export async function validatePin(code: string): Promise<PinValidationResult> {
  await delay(randomBetween(500, 1000))

  const override = getQueryParam('pin')
  if (override === 'invalid') {
    return { valid: false }
  }

  // Default: PIN valido se tiver 6 digitos
  return { valid: code.length === 6 }
}

// === File Upload ===

export async function uploadFile(
  file: File,
  type: 'document' | 'logo',
): Promise<FileUploadResult> {
  await delay(randomBetween(1500, 3000))

  // Always succeeds in mock
  return {
    success: true,
    url: `https://mock.storage/${type}/${file.name}`,
  }
}
