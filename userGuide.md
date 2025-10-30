# Guia do Usuário - Gerenciador de Pessoas

## Sobre o Sistema

Este é um gerenciador de pessoas e credenciamento que funciona 100% no seu navegador. Todos os dados ficam salvos localmente no seu computador, garantindo total privacidade.

## Powered by Manus

Este aplicativo foi desenvolvido com tecnologias modernas e eficientes:

- **Frontend:** React 19 + TypeScript + Vite para desenvolvimento rápido e interface responsiva
- **Estilização:** Tailwind CSS 4 + shadcn/ui para design moderno e consistente
- **Validação:** Zod + React Hook Form para validação robusta de formulários
- **Geração de PDF:** pdf-lib para criar documentos PDF profissionais com três formatos diferentes
- **Virtualização:** react-window para performance otimizada com milhares de registros
- **Persistência:** localStorage com versionamento automático para compatibilidade
- **Deployment:** Auto-scaling infrastructure with global CDN

## Usando o Sistema

### Cadastrar uma Pessoa

1. Preencha os campos do formulário no topo da página:
   - "Nome": Digite o nome completo
   - "Número do Cartão": Digite apenas números (será mascarado automaticamente)
   - "CPF": Digite 11 dígitos (será formatado como 000.000.000-00 automaticamente)
   - "RG": Digite números e opcionalmente X no final
2. Clique em "Adicionar"
3. Veja a confirmação "Pessoa adicionada com sucesso!" no canto da tela

### Visualizar a Lista

A lista mostra todas as pessoas cadastradas em ordem alfabética. Para cada pessoa você vê:
- Nome completo
- Cartão mascarado (apenas primeiros 3 dígitos visíveis, ex: 123****)
- CPF formatado (111.444.777-35)
- RG

### Editar uma Pessoa

1. Clique no ícone de lápis ao lado do nome da pessoa
2. Modifique os campos desejados no formulário que aparece
3. Clique em "Salvar" ou "Cancelar"

### Remover uma Pessoa

1. Clique no ícone de lixeira ao lado do nome
2. Confirme a remoção no diálogo que aparece
3. Use "Desfazer" no toast que aparece se removeu por engano

### Exportar para PDF

1. Clique em "Exportar PDF" no topo da lista
2. Digite um título para o documento (ex: "Lista de Participantes - Evento 2025")
3. Escolha um dos três formatos:
   - **Tabela**: Lista formatada com bordas e colunas organizadas
   - **Contínuo**: Lista limpa sem linhas, otimizada para leitura
   - **Assinaturas**: Cada nome com espaço em branco para assinatura manuscrita
4. Clique em "Exportar"
5. O PDF será baixado automaticamente com nome no formato: `titulo-AAAA-MM-DD-HHmm.pdf`

### Remover Todos os Registros

1. Clique em "Remover Todos" (botão vermelho)
2. Confirme a ação no diálogo
3. Use "Desfazer" se mudou de ideia

## Gerenciando o Sistema

### Dados Locais

Todos os dados ficam salvos no localStorage do seu navegador. Isso significa:
- ✅ Total privacidade - nada é enviado para servidores
- ✅ Funciona offline
- ⚠️ Se limpar os dados do navegador, perde os registros
- ⚠️ Dados não são compartilhados entre diferentes navegadores ou dispositivos

### Backup

Para fazer backup dos seus dados:
1. Exporte um PDF com todos os registros no formato "Tabela"
2. Guarde o PDF em local seguro
3. Se precisar recuperar, digite os dados manualmente a partir do PDF

## Próximos Passos

Converse com a Manus AI a qualquer momento para solicitar mudanças ou adicionar funcionalidades. Algumas sugestões:
- Adicionar campo de foto para as pessoas
- Criar filtros de busca por nome ou CPF
- Adicionar categorias ou tags
- Exportar para Excel ou CSV
- Implementar importação de dados
