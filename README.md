# Gerenciador de Pessoas e Credenciamento

**Aplicativo web estático para gerenciar listas de pessoas e exportar em três formatos PDF profissionais.**

Este projeto foi desenvolvido com React 19, TypeScript, Vite e Tailwind CSS, oferecendo uma solução completa e moderna para gerenciamento de credenciamento, listas de participantes e controle de acesso. O aplicativo funciona 100% no navegador, sem necessidade de servidor, e persiste os dados localmente usando `localStorage`.

---

## 📋 Índice

- [Características Principais](#-características-principais)
- [Stack Tecnológica](#-stack-tecnológica)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Deploy no GitHub Pages](#-deploy-no-github-pages)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Funcionalidades Detalhadas](#-funcionalidades-detalhadas)
- [Checklist de QA](#-checklist-de-qa)
- [Limitações e Notas de Privacidade](#-limitações-e-notas-de-privacidade)
- [Licença](#-licença)

---

## ✨ Características Principais

O **Gerenciador de Pessoas e Credenciamento** oferece uma experiência completa e profissional para gerenciar listas de pessoas com as seguintes funcionalidades:

### Gerenciamento de Dados

- **Campos flexíveis**: Nome, Número do Cartão, CPF e RG (nenhum campo é obrigatório)
- **Validação inteligente**: CPF com validação de dígitos verificadores, RG aceita dígitos e "X", cartão aceita dígitos e espaços
- **Máscaras automáticas**: Formatação em tempo real para CPF (###.###.###-##) e cartão (grupos de 4 dígitos)
- **Ordenação alfabética**: Lista sempre ordenada por nome usando `Intl.Collator` com sensibilidade base para português brasileiro (nomes vazios aparecem no final)
- **Persistência local**: Dados salvos automaticamente no `localStorage` com versionamento

### Interface do Usuário

- **Design moderno**: Tema light com glassmorphism sutil e gradientes em azul e vermelho
- **Lista virtualizada**: Performance otimizada para até 5.000 registros usando `react-window`
- **Ações rápidas**: Editar e remover pessoas individualmente com confirmação
- **Remoção em lote**: Botão "Remover Todos" com diálogo de confirmação
- **Undo inteligente**: Desfazer última remoção (individual ou em lote) com um clique
- **Feedback visual**: Toasts para sucesso, erro e ações com opção de desfazer
- **Sticky action bar**: Barra de ações sempre visível ao rolar listas longas
- **Responsivo**: Interface adaptável para desktop, tablet e mobile
- **Acessível**: Focus visível, labels, atributos ARIA e contraste AA

### Exportação de PDF

O aplicativo oferece **três formatos profissionais de exportação em PDF**, todos com:

- **Título obrigatório**: Solicitado antes da exportação, com preset do último título usado
- **Cabeçalho**: Título centralizado em todas as páginas
- **Rodapé**: Data/hora e numeração de páginas (Página X/Y)
- **Paginação A4**: Margens corretas e quebra automática de páginas
- **Privacidade**: Número do cartão mascarado (apenas primeiros 3 caracteres visíveis)
- **Nomenclatura automática**: Arquivos nomeados como `<titulo>-<AAAA-MM-DD>-<HHmm>.pdf`
- **Web Worker**: Geração em background para não congelar a interface

#### Formatos de PDF

1. **Tabela**: Lista em formato de tabela com cabeçalho, bordas leves e colunas fixas (Nome | Cartão | CPF/RG)
2. **Contínuo**: Lista limpa sem linhas ou tabelas, otimizada para leitura rápida
3. **Assinaturas**: Cada nome em sua própria linha com área em branco (~3-4 cm) para assinatura manuscrita após impressão

---

## 🛠 Stack Tecnológica

Este projeto utiliza tecnologias modernas e consolidadas para garantir performance, manutenibilidade e experiência de desenvolvimento de alta qualidade:

### Frontend

- **React 19**: Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.6**: Superset tipado de JavaScript para maior segurança e produtividade
- **Vite 7**: Build tool ultrarrápido com HMR (Hot Module Replacement)
- **Tailwind CSS 4**: Framework CSS utility-first para estilização rápida e consistente
- **shadcn/ui**: Componentes React acessíveis e customizáveis (Button, Card, Dialog, etc.)
- **Wouter**: Roteador leve para React (alternativa ao React Router)

### Formulários e Validação

- **React Hook Form 7**: Gerenciamento de formulários com performance otimizada
- **Zod 3**: Validação de schemas TypeScript-first
- **@hookform/resolvers**: Integração entre React Hook Form e Zod

### Geração de PDF

- **pdf-lib 1.17**: Biblioteca JavaScript pura para criação e manipulação de PDFs
- **date-fns 4**: Biblioteca moderna para manipulação de datas

### Virtualização

- **react-window 2**: Lista virtualizada para renderização eficiente de grandes listas

### Ferramentas de Desenvolvimento

- **ESLint**: Linter para identificar e corrigir problemas no código
- **Prettier**: Formatador de código para manter consistência
- **pnpm**: Gerenciador de pacotes rápido e eficiente

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js**: versão 18.x ou superior ([Download](https://nodejs.org/))
- **pnpm**: gerenciador de pacotes (instale com `npm install -g pnpm`) ou use **npm** como alternativa

Para verificar as versões instaladas:

```bash
node --version
pnpm --version
```

---

## 🚀 Instalação

Siga os passos abaixo para configurar o projeto localmente:

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/gerenciador-pessoas.git
cd gerenciador-pessoas
```

### 2. Instale as dependências

Com **pnpm** (recomendado):

```bash
pnpm install
```

Ou com **npm**:

```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento

Com **pnpm**:

```bash
pnpm dev
```

Ou com **npm**:

```bash
npm run dev
```

O aplicativo estará disponível em **http://localhost:3000**.

---

## 📜 Scripts Disponíveis

O projeto inclui os seguintes scripts para desenvolvimento, build e manutenção:

| Script | Comando (pnpm) | Comando (npm) | Descrição |
|--------|----------------|---------------|-----------|
| **Desenvolvimento** | `pnpm dev` | `npm run dev` | Inicia o servidor de desenvolvimento com HMR |
| **Build** | `pnpm build` | `npm run build` | Compila o projeto para produção na pasta `dist/public` |
| **Preview** | `pnpm preview` | `npm run preview` | Visualiza o build de produção localmente |
| **Lint** | `pnpm lint` | `npm run lint` | Executa ESLint para verificar problemas no código |
| **Type Check** | `pnpm typecheck` | `npm run typecheck` | Verifica erros de tipagem TypeScript |

### Exemplo de uso

```bash
# Desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Verificar build localmente
pnpm preview

# Verificar código
pnpm lint
pnpm typecheck
```

---

## 🌐 Deploy no GitHub Pages

O projeto está configurado para deploy no **GitHub Pages** usando **GitHub Actions**. Siga os passos abaixo:

### 1. Configurar o `base` no `vite.config.ts`

Se você for publicar em `https://username.github.io/repo-name/`, edite o arquivo `vite.config.ts` e descomente a linha `base`:

```typescript
// vite.config.ts
export default defineConfig({
  // ...
  base: '/repo-name/', // Substitua 'repo-name' pelo nome do seu repositório
  // ...
});
```

Se for publicar em um domínio customizado ou em `https://username.github.io/`, mantenha:

```typescript
base: './',
```

### 2. Criar o workflow do GitHub Actions

Crie o arquivo `.github/workflows/deploy.yml` na raiz do projeto:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main # ou 'master', dependendo do seu branch principal

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist/public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. Configurar GitHub Pages no repositório

1. Acesse **Settings** → **Pages** no seu repositório
2. Em **Source**, selecione **GitHub Actions**
3. Faça commit e push do código
4. O deploy será executado automaticamente

### 4. Acessar o site

Após o deploy, o site estará disponível em:

- `https://username.github.io/repo-name/` (se configurou `base: '/repo-name/'`)
- `https://username.github.io/` (se for um repositório de usuário)

---

## 📁 Estrutura do Projeto

```
gerenciador-pessoas/
├── client/                      # Código do frontend
│   ├── public/                  # Arquivos estáticos
│   └── src/
│       ├── components/          # Componentes React
│       │   ├── ui/              # Componentes shadcn/ui
│       │   ├── ConfirmDialog.tsx
│       │   ├── EditPersonDialog.tsx
│       │   ├── ExportPDFDialog.tsx
│       │   ├── PersonForm.tsx
│       │   └── PeopleList.tsx
│       ├── hooks/               # Hooks personalizados
│       │   ├── useLocalStorage.ts
│       │   ├── usePeople.ts
│       │   └── usePDFExport.ts
│       ├── lib/                 # Utilitários e lógica de negócio
│       │   ├── pdfGenerator.ts  # Geração de PDFs com pdf-lib
│       │   ├── types.ts         # Tipos TypeScript
│       │   └── validation.ts    # Validação e formatação
│       ├── pages/               # Páginas da aplicação
│       │   ├── Home.tsx
│       │   └── NotFound.tsx
│       ├── workers/             # Web Workers
│       │   └── pdfWorker.ts     # Worker para geração de PDF
│       ├── App.tsx              # Componente raiz
│       ├── main.tsx             # Entry point
│       └── index.css            # Estilos globais
├── dist/                        # Build de produção (gerado)
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions para deploy
├── .prettierrc                  # Configuração do Prettier
├── eslint.config.js             # Configuração do ESLint
├── vite.config.ts               # Configuração do Vite
├── tailwind.config.ts           # Configuração do Tailwind
├── tsconfig.json                # Configuração do TypeScript
├── package.json                 # Dependências e scripts
├── LICENSE                      # Licença MIT
└── README.md                    # Este arquivo
```

---

## 🎯 Funcionalidades Detalhadas

### Gerenciamento de Pessoas

O aplicativo permite adicionar, editar e remover pessoas com os seguintes campos:

- **Nome**: Campo de texto livre (aceita caracteres especiais e acentos)
- **Número do Cartão**: Aceita apenas dígitos e espaços, formatado automaticamente em grupos de 4
- **CPF**: Máscara automática `###.###.###-##` com validação de dígitos verificadores
- **RG**: Aceita dígitos e a letra "X" (maiúscula ou minúscula)

Nenhum campo é obrigatório, permitindo flexibilidade no cadastro.

### Ordenação Alfabética

A lista de pessoas é **sempre ordenada alfabeticamente** usando `Intl.Collator('pt-BR', { sensitivity: 'base' })`, que:

- Ignora diferenças de maiúsculas/minúsculas
- Ignora acentos para ordenação (mas preserva na exibição)
- Coloca nomes vazios no final da lista
- Em caso de empate, ordena por data de criação (ordenação estável)

### Persistência de Dados

Os dados são salvos automaticamente no `localStorage` do navegador com:

- **Versionamento**: Sistema de versão para migração futura de dados
- **Tratamento de erros**: Mensagens claras quando o `localStorage` está indisponível ou cheio
- **Recuperação automática**: Dados restaurados ao recarregar a página

### Privacidade e Segurança

- **Mascaramento de cartão**: Apenas os primeiros 3 caracteres são exibidos na interface e nos PDFs (ex: `123***********`)
- **Dados locais**: Nenhuma informação é enviada para servidores externos
- **Demo-only**: Este aplicativo é destinado a demonstração e não deve ser usado para dados sensíveis em produção

### Geração de PDF

Os PDFs são gerados usando **pdf-lib**, uma biblioteca JavaScript pura que funciona 100% no navegador. A geração acontece em um **Web Worker** para evitar congelamento da interface, especialmente com listas grandes.

#### Características dos PDFs

- **Formato A4**: 595.28 x 841.89 pontos
- **Margens**: 50 pontos em todos os lados
- **Fonte**: Helvetica (regular e bold) para compatibilidade universal
- **Codificação**: UTF-8 para suporte a acentos e caracteres especiais
- **Paginação automática**: Quebra de página inteligente para evitar corte de conteúdo

---

## ✅ Checklist de QA

Use este checklist para validar o funcionamento do aplicativo:

### Funcionalidades Básicas

- [ ] Adicionar pessoa com todos os campos preenchidos
- [ ] Adicionar pessoa com campos vazios (permitido)
- [ ] Editar pessoa existente
- [ ] Remover pessoa individual com confirmação
- [ ] Remover todas as pessoas com confirmação
- [ ] Desfazer última remoção (individual)
- [ ] Desfazer remoção em lote

### Validação e Formatação

- [ ] CPF: máscara aplicada corretamente (`###.###.###-##`)
- [ ] CPF: validação de dígitos verificadores funciona
- [ ] CPF: rejeita CPFs inválidos (ex: `111.111.111-11`)
- [ ] RG: aceita dígitos e "X"
- [ ] Cartão: aceita apenas dígitos e espaços
- [ ] Cartão: formatado em grupos de 4 dígitos

### Ordenação

- [ ] Lista ordenada alfabeticamente (case-insensitive)
- [ ] Nomes com acentos ordenados corretamente
- [ ] Nomes vazios aparecem no final
- [ ] Ordenação estável (empates mantêm ordem de criação)

### Interface

- [ ] Responsivo em desktop, tablet e mobile
- [ ] Focus visível em todos os elementos interativos
- [ ] Toasts aparecem para sucesso e erro
- [ ] Sticky action bar visível ao rolar
- [ ] Loading exibido durante geração de PDF

### Exportação PDF

- [ ] Modal de exportação solicita título obrigatório
- [ ] Último título usado aparece como preset
- [ ] PDF Tabela: cabeçalho, bordas e colunas corretas
- [ ] PDF Contínuo: lista limpa sem linhas
- [ ] PDF Assinaturas: espaço para assinatura (~3-4 cm)
- [ ] Cabeçalho com título em todas as páginas
- [ ] Rodapé com data/hora e numeração (Página X/Y)
- [ ] Cartão mascarado nos PDFs (primeiros 3 caracteres)
- [ ] Nome do arquivo: `<titulo>-<AAAA-MM-DD>-<HHmm>.pdf`

### Performance e Robustez

- [ ] Lista com 1 pessoa funciona corretamente
- [ ] Lista com 100 pessoas: UI suave
- [ ] Lista com 5.000 pessoas: UI suave (virtualização)
- [ ] PDF com 1 pessoa
- [ ] PDF com 100 pessoas: paginação correta
- [ ] PDF com 500+ pessoas: sem clipping, paginação correta
- [ ] Nomes muito longos: quebra de linha correta
- [ ] Strings muito longas em CPF/RG/Cartão: tratamento adequado
- [ ] localStorage cheio: mensagem de erro clara
- [ ] localStorage indisponível: mensagem de erro clara

### Casos Extremos

- [ ] Lista vazia: mensagem adequada
- [ ] Todos os campos vazios: aceito e exibido como "—"
- [ ] Caracteres especiais em nomes (ex: ç, á, é, ã, õ)
- [ ] Nomes duplicados: ambos aparecem na lista
- [ ] Recarregar página: dados persistidos

---

## ⚠️ Limitações e Notas de Privacidade

### Limitações

1. **Armazenamento Local**: Os dados são salvos apenas no navegador. Se você limpar o cache ou usar outro navegador/dispositivo, os dados não estarão disponíveis.

2. **Capacidade**: O `localStorage` tem limite de ~5-10 MB dependendo do navegador. Com dados típicos, isso permite armazenar milhares de pessoas, mas listas muito grandes podem exceder o limite.

3. **Validação de CPF**: A validação verifica apenas a estrutura e os dígitos verificadores. Não verifica se o CPF existe ou está ativo na Receita Federal.

4. **Fontes em PDF**: Os PDFs usam fontes padrão (Helvetica) para compatibilidade universal. Fontes customizadas não são suportadas.

5. **Sincronização**: Não há sincronização entre dispositivos. Cada navegador mantém seus próprios dados.

### Privacidade e Segurança

**IMPORTANTE**: Este aplicativo foi desenvolvido para fins de **demonstração e uso interno**. Não deve ser usado para armazenar dados sensíveis em ambientes de produção sem as devidas precauções:

- **Dados locais**: Todas as informações são armazenadas localmente no navegador. Nenhum dado é enviado para servidores externos.

- **Mascaramento de cartão**: O número do cartão é sempre exibido mascarado (primeiros 3 caracteres visíveis) na interface e nos PDFs. O valor completo é armazenado no `localStorage`, mas nunca renderizado.

- **Sem criptografia**: Os dados no `localStorage` não são criptografados. Qualquer pessoa com acesso físico ao dispositivo pode visualizá-los.

- **Sem autenticação**: Não há controle de acesso. Qualquer pessoa que abrir o aplicativo pode visualizar e modificar os dados.

- **Sem backup**: Se o `localStorage` for limpo (manualmente ou por limpeza automática do navegador), os dados serão perdidos permanentemente.

### Recomendações para Uso em Produção

Se você planeja usar este aplicativo em produção com dados reais:

1. Implemente autenticação e autorização
2. Use um backend para armazenamento persistente e seguro
3. Adicione criptografia para dados sensíveis
4. Implemente backup automático
5. Adicione logs de auditoria
6. Revise e ajuste as políticas de privacidade conforme LGPD/GDPR

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.

**Copyright (c) 2025 Leonardo Gonçalves Sobral**

Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

Este projeto utiliza tecnologias open-source incríveis:

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [pdf-lib](https://pdf-lib.js.org/)
- [react-window](https://react-window.vercel.app/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---

## 📧 Contato

**Autor**: Leonardo Gonçalves Sobral

Para dúvidas, sugestões ou contribuições, abra uma [issue](https://github.com/seu-usuario/gerenciador-pessoas/issues) no GitHub.

---

**Desenvolvido com ❤️ usando React, TypeScript e Vite**
