# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Mostra Sua Pegada** is a Next.js + React conversational AI interface for collecting company data in a multi-step flow. The system tracks users through a guided registration process with dynamic branching based on validation results.

- **Status:** Phases 0 & 1 complete (foundation/architecture)
- **Stack:** Next.js 15.5.14, React 19, TypeScript 5, Tailwind CSS v4
- **Key Entry:** `/empresa` route (Company Participant flow)
- **Architecture Focus:** Decoupled state machine, pure business logic, no component-level logic

## Commands

### Development
```bash
npm run dev           # Start dev server (http://localhost:3000 → /empresa)
npm run build         # Production build
npm run start         # Run production build
npm lint              # Check code with ESLint
npx tsc --noEmit      # Type-check without emitting
```

### Pre-build Setup
Assets are automatically copied from `_assets/` to `public/` via the `prebuild` script (defined in package.json). This runs before every build/dev session.

## Architecture

### High-Level Design

The project is structured around **decoupled layers**:

```
UI Components (Fase 2+)
    ↓
useFluxoEmpresa Hook (Fase 1) ← Orchestrator
    ↓
State Machine + Reducer (Fase 1) ← Pure logic, no side effects
    ↓
Flow Content (Fase 1) ← All AI text lives here
    ↓
AI Simulator + Mock Backend (Fase 1) ← Fake delays/validation
```

This separation ensures:
- **Business logic is testable independently** of React
- **Content can be reused** across `/empresa`, `/fornecedor`, `/admin` (different personas)
- **Components are dumb** — they receive state and call actions, no conditional logic

### Fase Breakdown

**Fase 0 — Bootstrap (COMPLETE)**
- Next.js scaffolding, Tailwind v4 setup, CSS variables (design tokens)
- Shell layout: header (Nude. + #MostraSuaPegada), central card, footer
- Background grid perspective effect via `img_grade_bg.webp`
- `app/empresa/page.tsx` is currently a shell; components will fill it in

**Fase 1 — Types + State Machine (COMPLETE, 1,267 LOC)**
- `types/chat.ts` — Full typed contract (ChatMessage, ComposerMode, FlowStep, FlowEvent, EmpresaData)
- `lib/fluxo-empresa/state-machine.ts` — Pure reducer with 28 steps + 52+ transitions
- `lib/fluxo-empresa/flow-content.ts` — All AI text centralized (26 steps, extracted from `_refs/chat_example.md`)
- `lib/fluxo-empresa/ai-simulator.ts` — Typing delays (500–1200ms), message sequences
- `lib/fluxo-empresa/mock-backend.ts` — CNPJ validation, sector check, document analysis, PIN validation, file upload (supports query params to force test scenarios: `?cnpj=blocked`, `?doc=not_eligible`, etc.)
- `hooks/useFluxoEmpresa.ts` — Orchestrator hook; dispatches backend calls and AI sequences based on state transitions

**Fase 2 — UI Components (NEXT)**
- MessageList, MessageBubbleAI (avatar "N." + Courier New), MessageBubbleUser, TypingIndicator
- ChatComposer (8 modes: text, text-long, quick-reply, file, file-preview, pin, disabled, loading)
- Quick Replies (semantic: confirm/reject/neutral/action intents → colors)

**Fase 3 — Integration (PLANNED)**
- Connect components to useFluxoEmpresa
- Test linear happy path (WELCOME → ASK_COMPANY_NAME → ... → FLOW_COMPLETE_ELIGIBLE)

**Fase 4 — Branching (PLANNED)**
- Implement all 28 steps including blocker paths (CNPJ_BLOCKED, SECTOR_CONTROVERSIAL, RESULT_NOT_ELIGIBLE, RESULT_AMBIGUOUS)

**Fase 5 — Polish (PLANNED)**
- Responsiveness, accessibility, animations, edge cases

## Key Design Decisions

### State Machine is the Source of Truth
- All flow logic lives in `getNextStep()` function (state-machine.ts)
- Components never decide which state comes next
- This prevents logic scattered across components

### Content is Decoupled
- All AI text is in `flow-content.ts`, extracted from `_refs/chat_example.md`
- No hardcoded text in components or hooks
- Enables content reuse for `/fornecedor` and `/admin` flows (just swap flow-content.ts)

### Pure Reducer Architecture
- `chatReducer` has NO side effects — only state transitions and data collection
- All async operations (AI delays, backend calls) happen in the hook via useEffect
- Enables unit testing without mocking React

### ComposerMode is Discriminated Union
- Each step defines which input type is active via `ComposerMode` union type
- 8 modes cover all scenarios (text input, file upload, quick replies, PIN, loading, disabled)
- Composer component reads this and renders the right UI

### 28 FlowSteps Cover All Paths
Including edge cases: CNPJ_BLOCKED, SECTOR_CONTROVERSIAL, RESULT_NOT_ELIGIBLE, RESULT_AMBIGUOUS, RESULT_CUSTOM_CONTRACT
- Each step has deterministic next-step logic
- No implicit transitions; all paths are explicit in state machine

## File Structure

### Core Fluxo Logic
```
lib/fluxo-empresa/
  state-machine.ts       # Reducer + transition table
  flow-content.ts        # All AI text
  ai-simulator.ts        # Typing delays, message sequences
  mock-backend.ts        # Fake validation endpoints
hooks/
  useFluxoEmpresa.ts     # Hook orchestrator
types/
  chat.ts                # Full type contract
```

### UI (Fase 2+)
```
components/layout/
  Header.tsx             # Header (static, already done Fase 0)
  ChatCard.tsx           # Central card shell (Fase 0)
  Footer.tsx             # Footer (Fase 0)
components/chat/         # New in Fase 2
  MessageList.tsx
  MessageBubbleAI.tsx
  MessageBubbleUser.tsx
  TypingIndicator.tsx
  ChatComposer.tsx
  QuickReplies.tsx
```

### Assets & Design
```
_assets/
  fonts/TT_Trailers_*.woff2  # Display font (copied to public/fonts/ via prebuild)
  img_grade_bg.webp          # Background grid perspective
  poweredby_plantongenius.svg
_refs/
  *.png                      # Figma prototypes (Tela_Inicio, Tela resposta, etc.)
  chat_example.md            # Source of truth for all AI text
  Empresa_participante.md    # Spec for data flow
```

### Config
```
app/
  globals.css                # @import tailwindcss, @font-face, @theme (design tokens)
  layout.tsx                 # RootLayout
  page.tsx                   # Redirect → /empresa
  empresa/page.tsx           # /empresa shell (components go inside)
```

## TypeScript & Linting

- **Strict mode enabled** — no implicit `any`
- **ESLint config:** `next/core-web-vitals` + `next/typescript`
- **Special rule:** `@typescript-eslint/no-unused-vars` allows `_` prefix for intentionally unused params (e.g., `_cnpj` in mock endpoints that must match an interface signature)
- **No type assertions** in existing code; all types are derived from discriminated unions

## Common Patterns

### Adding a New FlowStep

1. Add to `FlowStep` union in `types/chat.ts`
2. Add transition cases in `getNextStep()` function (state-machine.ts)
3. Add step content in `flowContent` object (flow-content.ts): `messages[]`, `composerMode`, optional `quickReplies`
4. If async work needed (backend call, delay), add handling in `useFluxoEmpresa` hook's `runEffects()` function

### Adding a New ComposerMode

1. Add variant to `ComposerMode` discriminated union (types/chat.ts)
2. Implement rendering in `ChatComposer` component (Fase 2)
3. Define transition rules: which steps lead to this mode

### Testing Logic
- State machine is pure: `chatReducer(state, event) → newState` can be tested directly
- Mock backend endpoints can be tested with query params: `?cnpj=blocked`, `?doc=ambiguous`
- Hook can be tested in isolation once components exist

## Design Tokens

All colors, fonts, and spacing are CSS variables in `app/globals.css` via Tailwind `@theme`:

```css
--color-bg: #efe4ce              /* Main background */
--color-surface: #f3f0eb         /* Card surface */
--color-border: #d9d4cc          /* Borders */
--color-green: #a9c8bc           /* Quick reply: confirm */
--color-orange: #dcae75          /* Quick reply: reject */
--color-blue: #a1c3d0            /* Quick reply: neutral */
--color-purple: #c0bed8          /* Quick reply: action */
--font-display: 'TT Trailers'    /* Headings */
--font-text: 'Courier New'       /* Body text */
```

Use these in components via inline styles or Tailwind classes (e.g., `bg-[var(--color-surface)]`).

## Development Workflow

1. **Start dev server:** `npm run dev` (hot reload enabled)
2. **Type-check:** `npx tsc --noEmit` (runs before build)
3. **Lint:** `npm lint` (ESLint, strict TypeScript)
4. **Build:** `npm run build` (runs `prebuild` to copy assets, then Next.js build)
5. **Test scenarios:** Use query params in browser:
   - `http://localhost:3000/empresa?cnpj=blocked` → CNPJ blocker path
   - `?doc=not_eligible` → Document validation failure
   - `?pin=invalid` → PIN always fails (test retry)

## Important Notes

### Path Aliases
- `@/*` resolves to root (no `src/` directory)
- Use `@/lib/fluxo-empresa/*`, `@/components/`, `@/types/` in imports

### Next.js App Router
- File-based routing: `/app/empresa/page.tsx` → route `/empresa`
- `page.tsx` files are the route handlers
- Server Components by default; use `'use client'` at the top of files that need React hooks

### Tailwind v4
- No `tailwind.config.ts` file — all config in CSS via `@theme`
- PostCSS plugin: `@tailwindcss/postcss`
- CSS variables work with Tailwind utilities (e.g., `bg-[var(--color-surface)]`)

### Assets Copying
- `prebuild` script runs before `dev` and `build`
- Copies fonts and images from `_assets/` to `public/`
- `public/` files are gitignored (added in prebuild)
- `_assets/` is the source of truth

## Documentation References

- **Planning:** [_prompts/PLANO_EXECUCAO_FRONTEND_EMPRESA_v2.md](_prompts/PLANO_EXECUCAO_FRONTEND_EMPRESA_v2.md) — Full execution plan with status
- **Product Spec:** [_refs/Empresa_participante.md](_refs/Empresa_participante.md) — User flow, validation rules, business logic
- **Content Source:** [_refs/chat_example.md](_refs/chat_example.md) — All AI messages (source of truth for flow-content.ts)
- **Figma Prototypes:** `_refs/*.png` — Visual references for components

## Next Steps (Fase 2)

When implementing UI components:
1. Build `MessageList` and message bubbles first (static rendering)
2. Hook up `useFluxoEmpresa` to test state flows with mock data
3. Implement `ChatComposer` with all 8 modes
4. Add quick replies with semantic intents (colors by intent)
5. Ensure pixel-perfect match with `_refs/Tela_Inicio.png`, `_refs/Tela resposta.png`, etc.
