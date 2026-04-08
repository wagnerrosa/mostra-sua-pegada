# Mostra Sua Pegada

[🇧🇷 Português](./README.md) | [🇺🇸 English](./README_en.md)

Conversational interface for company onboarding in the Mostra Sua Pegada program, an initiative by Nude focused on product carbon footprint transparency. The `/empresa` flow covers the onboarding of participating companies.

This project converts a traditional form-based process into a guided conversational experience, aiming to reduce friction, improve clarity, and make onboarding more suitable for mobile devices. This repository focuses on the `/empresa` flow, targeting participating companies.

## Introduction

The product is part of a real Nude initiative:

- Official website: <https://www.mostrasuapegada.com.br/>

Within the program context, the platform needs to allow companies to:

- register to participate in the movement;
- submit documentation related to the product's carbon footprint;
- progress through eligibility stages, terms acceptance, PIN confirmation, and brand submission;
- be properly routed in alternative scenarios such as blocked CNPJ, controversial sector, ambiguous or non-eligible document.

Registration is done through a conversational interface instead of a traditional form, with progressive steps, validations, and explicit branching.

## Demonstration

The experience was designed in two layers:

1. **Pre-chat**  
   An initial more guided screen, with headline, context, and quick actions to reduce the emptiness of the first fold.
2. **Chat**  
   From the first interaction, the interface transitions to the main conversation, where the AI leads the onboarding step by step.

The flow includes:

- progressive collection of company and responsible person data;
- asynchronous validations of CNPJ and sector;
- simulated document submission and analysis;
- explicit branching for eligibility, manual review, and non-eligibility;
- quick replies, file upload, PIN, and flow closure.

## Product Concept

The flow was implemented as a conversational interface, replacing the traditional form model.

In a flow with multiple steps, validations, exceptions, and potentially technical language, the conversational model offers clear advantages:

- breaks complexity into smaller steps;
- reduces cognitive load compared to an extensive form;
- creates a continuous sense of progress;
- allows explaining context at the right moment, instead of anticipating everything at once;
- brings the tone closer to the Nude brand experience, which is more human, accessible, and direct.

## Architecture

The project was structured to maintain a rich conversational experience without sacrificing technical predictability.

### Main layers

```text
UI
  PreChatShell, MessageList, MessageBubble*, QuickReplies, ChatComposer
    ↓
Orchestrator hook
  useFluxoEmpresa
    ↓
Flow logic
  state-machine.ts
    ↓
Decoupled content
  flow-content.ts
    ↓
Simulation infrastructure
  ai-simulator.ts + mock-backend.ts
```

### Why this separation was chosen

- The **state machine** concentrates the business rules and flow transitions.
- The **orchestrator hook** connects reducer, asynchronous simulations, and mocked backend without pushing side effects to the UI.
- The **UI** remains more declarative: renders state, triggers actions, and avoids deciding the flow.
- The **content** is separated from the logic, allowing to evolve microcopy, tone, and persona variants without rewriting components.

### Practical benefits

- greater testability of business logic;
- easier maintenance of flows with branching;
- structural reuse for future journeys like `/fornecedor` and `/admin`;
- lower risk of regression when evolving the visual interface;
- better collaboration between product, content, design, and engineering.

## Key Technical Decisions

### 1. State machine as source of truth

The flow is modeled with explicit states and deterministic transitions.

### 2. Content decoupled from UI

AI messages are centralized in `flow-content.ts`, based on product and UX references from the project. Allows iterating content without changing the UI.

### 3. `ComposerMode` as discriminated union

The composer works with typed modes, such as:

- `text`
- `text-long`
- `quick-reply`
- `file`
- `file-preview`
- `pin`
- `loading`
- `disabled`

This contract makes the UI more predictable and reduces fragile conditionals inside the composition component.

### 4. Pure reducer + effects outside reducer

The reducer only performs state transitions and data collection. Asynchronous effects are handled in the hook.

### 5. Mock backend + AI simulator

The project was prepared for development and flow validation even without a real backend connected. The mock allows simulating critical scenarios and the AI simulator helps approximate the feel of a real conversation.

### 6. Pre-chat as activation layer

The flow no longer starts in an empty chat area. A `PRE_CHAT` state was added before `WELCOME`, creating a clearer, guided entry consistent with modern conversational products.

## Mobile Experience

The product was designed as **mobile-first**, which was relevant not only in layout but also in visual infrastructure decisions.

Important points:

- use of `viewport-fit=cover` to support screens with notch and home indicator;
- application of `safe-area-inset-*` in necessary structural points;
- use of `visualViewport` to expose `--vvh` and better respond to virtual keyboard and dynamic browser UI;
- layout chain with `flex` + `min-height: 0` to avoid scroll collapses on smaller screens;
- autofocus blocking on touch devices at chat entry, reducing jank with keyboard;
- `overscroll-behavior: contain` in critical areas to avoid bad scroll propagation;
- respect for `prefers-reduced-motion`.

These decisions were explicitly taken considering compatibility and stability on:

- **Safari on iOS**
- **Chrome on Android**

## UX and Design

Beyond architecture, the project carries strong experience decisions.

### Quick Replies to reduce friction

Quick Replies reduce typing, speed up simple decisions, and keep the conversation pace, especially on mobile.

### Voice tone aligned with the brand

Content with accessible and direct language, with occasional use of emojis.

### Adherence to Nude's MIV

The visual respects the brand universe:

- strong display typography for visual presence;
- use of color tokens consistent with reference material;
- central card with clean and editorial language;
- visual atmosphere consistent with Nude’s identity, even though the product is operated by Planton.

### Separation between UX and business rules

The flow integrates eligibility and validation rules with a legible presentation for the user.

## Tech Stack

- **Next.js** with App Router
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**

Relevant complements:

- design tokens in `app/globals.css` via `@theme`;
- client-side architecture oriented by reducer and orchestrator hook;
- mocked backend for flow scenarios;
- message and delay simulator to approximate conversational behavior.

## How to Run the Project

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open:

```bash
http://localhost:3000/empresa
```

### Useful scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npx tsc --noEmit
```

### Note on assets

Before build and development environment, the project copies assets from `_assets/` to `public/` via a `prebuild` script.

### Mock scenarios for flow validation

It is possible to simulate specific product paths via URL:

```bash
/empresa?cnpj=blocked
/empresa?cnpj=recadastro
/empresa?sector=controversial
/empresa?doc=eligible
/empresa?doc=not_eligible
/empresa?doc=ambiguous
/empresa?doc=custom
/empresa?pin=invalid
```

This helps demonstrate and validate alternative paths without relying on real integrations.

## Technical Considerations

- Conversational flow with multiple branching modeled by state machine.
- Content decoupled from UI for easier maintenance and evolution.
- Handling of dynamic viewport, virtual keyboard, and safe areas on mobile.
- Structure prepared for expansion to additional journeys.

## Next Steps

Natural improvements for project evolution:

- connect the flow to a real backend;
- replace provisional content, such as the terms block, with final versions integrated into the product;
- add automated tests for reducer, transitions, and orchestrator hook;
- expand the same architecture for `/fornecedor` and `/admin` flows;
- instrument analytics to monitor drop-off, conversion, and onboarding friction points.

## Project Structure

```text
app/
  empresa/page.tsx
  globals.css
  layout.tsx

components/
  chat/
  layout/

hooks/
  useFluxoEmpresa.ts

lib/fluxo-empresa/
  state-machine.ts
  flow-content.ts
  ai-simulator.ts
  mock-backend.ts

types/
  chat.ts
```

## Final Notes

Implementation of a conversational interface for onboarding with explicit business rules, prioritizing flow clarity, visual consistency, and stability on mobile devices.
