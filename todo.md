# TODO - Gerenciador de Pessoas

## Configuração Inicial
- [x] Instalar dependências (pdf-lib, react-window, react-hook-form, zod, date-fns)
- [x] Configurar ESLint e Prettier
- [x] Configurar vite.config.ts para GitHub Pages

## Modelo de Dados e Persistência
- [x] Criar interface Person (name, cardNumber, cpf, rg, createdAt, id)
- [x] Implementar localStorage versionado com fallback
- [x] Implementar ordenação alfabética pt-BR (Intl.Collator, nomes vazios no final)
- [x] Criar hooks personalizados (usePeople, useLocalStorage)

## Validação e Máscaras
- [x] Validação de CPF com dígitos verificadores
- [x] Máscara de CPF (###.###.###-##)
- [x] Validação de RG (dígitos e X)
- [x] Validação de cartão (dígitos e espaços)
- [x] Mascaramento de cartão (primeiros 3 caracteres visíveis)

## Interface do Usuário
- [x] Criar formulário de cadastro/edição com validação
- [x] Implementar lista virtualizada com react-window
- [x] Criar componente de item da lista com ações (editar/remover)
- [x] Implementar modal/inline de edição
- [x] Criar diálogo de confirmação para remoção
- [x] Implementar botão "Remover todos" com confirmação
- [x] Adicionar toasts para feedback (sucesso/erro)
- [x] Implementar undo (1 nível) para remoção

## Exportação PDF
- [x] Criar modal para solicitar título obrigatório (com preset do último usado)
- [x] Implementar PDF Tabela (cabeçalho, bordas, colunas fixas, paginação)
- [x] Implementar PDF Contínuo (lista limpa, sem linhas)
- [x] Implementar PDF Assinaturas (nome + área em branco para assinatura)
- [x] Adicionar cabeçalho com título em todas as páginas
- [x] Adicionar rodapé com data/hora e numeração (página X/Y)
- [x] Garantir paginação A4 com margens corretas
- [x] Implementar mascaramento de cartão nos PDFs
- [x] Nomear PDFs automaticamente (<titulo>-<AAAA-MM-DD>-<HHmm>.pdf)
- [x] Implementar Web Worker para geração de PDF (evitar congelamento)

## Estilo e UX
- [x] Aplicar tema light com glassmorphism sutil
- [x] Definir cores de destaque (azul e vermelho)
- [x] Garantir responsividade
- [x] Implementar estados de loading durante geração de PDF
- [x] Adicionar sticky action bar para listas longas
- [x] Garantir acessibilidade (focus visível, labels, aria-*, contraste AA)

## Performance e Robustez
- [ ] Testar com 5.000 registros (UI suave)
- [ ] Testar PDFs com muitos itens (paginação correta, sem clipping)
- [x] Implementar tratamento de erros para localStorage (indisponível/cheio)
- [ ] Validar entrada de strings muito longas

## Documentação
- [x] Criar README.md completo em pt-BR
- [x] Adicionar seção de pré-requisitos e instalação
- [x] Documentar scripts (dev, build, preview, lint, typecheck)
- [x] Adicionar instruções de deploy no GitHub Pages
- [x] Incluir screenshots/gif
- [x] Criar checklist de QA
- [x] Documentar limitações e notas de privacidade
- [x] Criar LICENSE MIT (autor: Leonardo Gonçalves Sobral)

## Testes e QA
- [x] Testar com lista vazia
- [x] Testar com 1 item
- [x] Testar com 5.000 itens
- [x] Testar nomes com acentos
- [ ] Testar nomes duplicados
- [x] Testar campos vazios
- [ ] Testar strings muito longas
- [x] Testar PDFs com múltiplas páginas
- [ ] Validar largura de colunas e quebra de linha
- [ ] Testar falhas de localStorage
- [x] Testar entradas inválidas

## Correções
- [x] Corrigir Input component para usar React.forwardRef() (compatibilidade com Controller)
