# Mostra Sua Pegada

[🇧🇷 Português](./README.md) | [🇺🇸 English](./README_en.md)

Interface conversacional para cadastro de empresas no programa Mostra Sua Pegada, iniciativa da Nude voltada à transparência da pegada de carbono de produtos. O fluxo `/empresa` cobre o onboarding de Empresas Participantes.

Este projeto transforma um processo tradicionalmente orientado por formulários em uma experiência guiada por conversa, com foco em reduzir fricção, aumentar clareza e tornar o onboarding mais acolhedor em dispositivos móveis. Neste repositório, o foco principal está no fluxo `/empresa`, voltado para **Empresas Participantes**.

## Introdução

O produto faz parte de uma iniciativa real da Nude:

- Site oficial: <https://www.mostrasuapegada.com.br/>

No contexto do programa, a plataforma precisa permitir que empresas:

- se cadastrem para participar do movimento;
- enviem documentação relacionada à pegada de carbono do produto;
- avancem por etapas de elegibilidade, aceite de termos, confirmação por PIN e envio de marca;
- sejam encaminhadas corretamente em cenários alternativos, como bloqueio de CNPJ, setor controverso, documento ambíguo ou não elegível.

O cadastro é realizado por meio de uma interface conversacional, em vez de formulário tradicional, com etapas progressivas, validações e ramificações explícitas.

## Demonstração

A experiência foi desenhada em duas camadas:

1. **Pré-chat**
   Uma tela inicial mais orientada, com headline, contexto e ações rápidas para reduzir o vazio da primeira dobra.
2. **Chat**
   A partir da primeira interação, a interface transiciona para a conversa principal, onde a IA conduz o cadastro passo a passo.

O fluxo inclui:

- coleta progressiva de dados da empresa e da pessoa responsável;
- validações assíncronas de CNPJ e setor;
- envio e análise simulada de documento;
- ramificações explícitas para elegibilidade, revisão manual e não elegibilidade;
- quick replies, upload de arquivo, PIN e encerramento do fluxo.


## Conceito do Produto

O fluxo foi implementado como interface conversacional, substituindo o modelo tradicional de formulário.

Em um fluxo com múltiplas etapas, validações, exceções e linguagem potencialmente técnica, o modelo conversacional oferece vantagens claras:

- divide a complexidade em passos menores;
- reduz carga cognitiva em comparação com um formulário extenso;
- cria sensação de progresso contínuo;
- permite explicar contexto no momento certo, em vez de antecipar tudo de uma vez;
- aproxima o tom da experiência da marca Nude, que é mais humana, acessível e direta.

## Arquitetura

O projeto foi estruturado para manter a experiência conversacional rica sem sacrificar previsibilidade técnica.

### Camadas principais

```text
UI
  PreChatShell, MessageList, MessageBubble*, QuickReplies, ChatComposer
    ↓
Hook orquestrador
  useFluxoEmpresa
    ↓
Lógica de fluxo
  state-machine.ts
    ↓
Conteúdo desacoplado
  flow-content.ts
    ↓
Infra de simulação
  ai-simulator.ts + mock-backend.ts
```

### Por que essa separação foi escolhida

- A **state machine** concentra a regra de negócio e as transições do fluxo.
- O **hook orquestrador** conecta reducer, simulações assíncronas e backend mockado sem empurrar efeitos colaterais para a UI.
- A **UI** permanece mais declarativa: renderiza estado, dispara ações e evita decidir o fluxo.
- O **conteúdo** fica separado da lógica, permitindo evoluir microcopy, tom e variantes de persona sem reescrever componentes.

### Benefícios práticos

- maior testabilidade da lógica de negócio;
- mais facilidade para manter fluxos com ramificações;
- reaproveitamento estrutural para futuras jornadas como `/fornecedor` e `/admin`;
- menor risco de regressão ao evoluir a interface visual;
- melhor colaboração entre produto, conteúdo, design e engenharia.

## Principais decisões técnicas

### 1. State machine como source of truth

O fluxo é modelado com estados explícitos e transições determinísticas.

### 2. Conteúdo desacoplado da UI

As mensagens da IA ficam centralizadas em `flow-content.ts`, a partir das referências de produto e UX do projeto. Permite iterar conteúdo sem alterar a UI.

### 3. `ComposerMode` como discriminated union

O composer trabalha com modos tipados, como:

- `text`
- `text-long`
- `quick-reply`
- `file`
- `file-preview`
- `pin`
- `loading`
- `disabled`

Esse contrato torna a UI mais previsível e reduz condicionais frágeis dentro do componente de composição.

### 4. Reducer puro + efeitos fora do reducer

O reducer faz apenas transição de estado e coleta de dados. Efeitos assíncronos são tratados no hook.

### 5. Mock backend + AI simulator

O projeto já foi preparado para desenvolvimento e validação de fluxo mesmo sem backend real conectado. O mock permite simular cenários críticos e o AI simulator ajuda a aproximar a sensação de conversa real.

### 6. Pré-chat como camada de ativação

O fluxo não começa mais em uma área vazia de chat. Um estado `PRE_CHAT` foi adicionado antes do `WELCOME`, criando uma entrada mais clara, orientada e consistente com produtos conversacionais modernos.

## Experiência Mobile

O produto foi pensado como **mobile-first**, o que foi relevante não só no layout, mas também nas decisões de infraestrutura visual.

Pontos importantes:

- uso de `viewport-fit=cover` para suportar telas com notch e home indicator;
- aplicação de `safe-area-inset-*` nos pontos estruturais necessários;
- uso de `visualViewport` para expor `--vvh` e responder melhor a teclado virtual e browser UI dinâmica;
- cadeia de layout com `flex` + `min-height: 0` para evitar colapsos de scroll em telas menores;
- bloqueio de autofocus em dispositivos touch na entrada do chat, reduzindo jank com teclado;
- `overscroll-behavior: contain` em áreas críticas para evitar propagação ruim de scroll;
- respeito a `prefers-reduced-motion`.

Essas decisões foram tomadas considerando explicitamente compatibilidade e estabilidade em:

- **Safari no iOS**
- **Chrome no Android**

## UX e Design

Além da arquitetura, o projeto carrega decisões fortes de experiência.

### Quick Replies para reduzir fricção

Quick Replies reduzem digitação, aceleram decisões simples e mantêm o ritmo da conversa, especialmente em mobile.

### Tom de voz alinhado com a marca

Conteúdo com linguagem acessível e direta, com uso pontual de emojis.

### Aderência ao MIV da Nude

O visual respeita o universo da marca:

- tipografia display forte para presença visual;
- uso de tokens de cor coerentes com o material de referência;
- card central com linguagem limpa e editorial;
- atmosfera visual consistente com a identidade da Nude, mesmo sendo um produto operado pela Planton.

### Separação entre UX e regra de negócio

O fluxo integra regras de elegibilidade e validação com uma apresentação legível para o usuário.

## Stack utilizada

- **Next.js** com App Router
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**

Complementos relevantes:

- design tokens em `app/globals.css` via `@theme`;
- arquitetura client-side orientada por reducer e hook orquestrador;
- backend mockado para cenários de fluxo;
- simulador de mensagens e delays para aproximar o comportamento conversacional.

## Como rodar o projeto

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abra:

```bash
http://localhost:3000/empresa
```

### Scripts úteis

```bash
npm run dev
npm run build
npm run start
npm run lint
npx tsc --noEmit
```

### Observação sobre assets

Antes do build e do ambiente de desenvolvimento, o projeto copia assets de `_assets/` para `public/` via script de `prebuild`.

### Cenários de mock para validação do fluxo

É possível simular caminhos específicos do produto pela URL:

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

Isso ajuda a demonstrar e validar caminhos alternativos sem depender de integrações reais.

## Considerações técnicas

- Fluxo conversacional com múltiplas ramificações modelado por state machine.
- Conteúdo desacoplado da UI para facilitar manutenção e evolução.
- Tratamento de viewport dinâmica, teclado virtual e safe areas em mobile.
- Estrutura preparada para expansão de jornadas adicionais.

## Próximos passos

Melhorias naturais para evolução do projeto:

- conectar o fluxo a um backend real;
- substituir conteúdos provisórios, como o bloco de termos, por versões finais integradas ao produto;
- adicionar testes automatizados para reducer, transições e hook orquestrador;
- expandir a mesma arquitetura para os fluxos `/fornecedor` e `/admin`;
- instrumentar analytics para acompanhar abandono, conversão e pontos de fricção do onboarding.

## Estrutura do projeto

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

## Considerações finais

Implementação de interface conversacional para onboarding com regras de negócio explícitas, priorizando clareza de fluxo, consistência visual e estabilidade em dispositivos móveis.
