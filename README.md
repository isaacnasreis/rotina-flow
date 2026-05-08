# 🌌 Flow State — Gerenciador de Rotina de Alta Performance

O **Flow State** (Rotina Flow) é um gerenciador de rotinas diárias e blocos de tempo ultradinamizado, desenvolvido para profissionais, criadores e estudantes que buscam alcançar e manter o estado de fluxo (*flow state*) em suas atividades diárias.

Com uma interface moderna, minimalista e imersiva baseada em um tema escuro profundo, acentos neon vibrantes e detalhes de vidro fosco (glassmorphism), o aplicativo ajuda a segmentar o dia de forma intuitiva, focando na **vibração e nível de energia** necessários para cada tarefa.

---

## 🎨 Identidade Visual & Branding Premium

*   **🧬 Logotipo Animado (`Logo.tsx`):** O sistema possui um logotipo baseado em uma **curva de Mobius (símbolo do infinito estilizado)** desenhada via código SVG puro. O logo conta com degradê neon (roxo para azul elétrico), um brilho pulsante de fundo (*backdrop blur*) e um núcleo central reativo (`animate-ping`).
*   **🌐 Favicon de Alta Definição (`icon.tsx`):** Implementamos o gerador dinâmico de ícones do Next.js App Router (`ImageResponse`). Ele renderiza de forma estrita o nosso logotipo SVG em formato PNG de alta definição diretamente nas abas do navegador, garantindo nitidez cristalina em telas Retina/High-DPI.

---

## ✨ Funcionalidades Principais

*   **⚡ Categorização por Nível de Energia (Vibração):** Organize suas tarefas com base no seu estado mental e energia necessários. Cada categoria possui sua própria aura, brilho e borda colorida dinâmica no aplicativo:
    *   `Foco Profundo` *(Fuchsia)* — Atividades que exigem concentração absoluta.
    *   `Fluxo Criativo` *(Cyan)* — Atividades voltadas para inovação, design e ideias.
    *   `Recarregar` *(Emerald)* — Intervalos, refeições e autocuidado para recarregar as energias.
    *   `Conectar` *(Orange)* — Reuniões, chamadas ou interações com outras pessoas.
    *   `Operacional` *(Slate)* — Tarefas administrativas de baixo esforço cognitivo.
*   **📂 Blocos de Rotina Dinâmicos:** Segmente suas tarefas em blocos personalizados (como *Manhã*, *Tarde*, *Trabalho*).
    *   *Retenção de Dados:* Ao excluir um bloco personalizado, as tarefas associadas a ele **não são perdidas**; elas retornam automaticamente para o bloco padrão **"Geral"**.
*   **⏱️ Smart Time Manager (Controle Inteligente de Tempo):**
    *   Defina horários de início e término com rapidez usando seletores de duração ágeis (`15m`, `30m`, `1h`, `2h` ou `Livre`).
    *   Edição direta na listagem através de inputs de texto reativos com auto-save imediato.
*   **⚡ Ações Rápidas em Massa:**
    *   *Concluir Tudo:* Um botão reativo para concluir instantaneamente todos os seus fluxos do dia atual com um único clique.
    *   *Limpar Rotina:* Permite remover de forma massiva as tarefas de hoje para redefinir o seu painel, protegido por um **modal de confirmação glassmorphic vermelho cinemático** contra cliques acidentais.
*   **🔗 Link de Compartilhamento Zero-Auth:** Compartilhe sua rotina de hoje de forma rápida e segura. O sistema gera um token de acesso exclusivo que permite que qualquer pessoa visualize sua rotina em modo **leitura (Read-Only)** sem precisar criar uma conta ou fazer login.

---

## 🛡️ Segurança & Blindagem de Dados

Para garantir uma hospedagem segura no seu portfólio onde qualquer pessoa possa testar o app, implementamos travas robustas de proteção:

*   **🔒 Proteção Antivazamento (Prevenção de IDOR):** Todas as Server Actions mutativas (`toggleTaskStatus`, `deleteTask`, `updateTask`, `deleteBlock`, `generateShareToken`, `revokeShareToken`) validam de forma estrita a sessão do usuário via cookies criptografados.
*   **🚫 Filtro de Palavras Ofensivas (Censura Inteligente):** O app conta com um analisador de texto estrito para títulos e descrições de tarefas. O filtro utiliza correspondência de limites de palavras (`\b`) e normalização Unicode (remoção automática de acentos como `púta`, `mêrda`, etc.) para **bloquear palavras de baixo calão em português sem gerar falsos positivos** em termos válidos (como "computador", "apostar" ou "leguminosas").
*   **⏳ Limite Diário de Spam:** Cada usuário pode criar um **limite máximo de 15 tarefas por dia**. Isso previne de forma completa o estouro de dados (*database bloating*) ou spam intencional por robôs de testes ou visitantes maliciosos na sua hospedagem de portfólio.

---

## 👥 Contas de Testes (Demo) do Portfólio

Para facilitar o teste completo da aplicação pelos recrutadores e visitantes do seu portfólio, o script de sementes (`seed.ts`) cria duas contas de convidados prontas e preenchidas com dados fictícios interessantes:

### **Conta 1: Visitante Alpha**
*   **Username:** `convidado`
*   **PIN:** `0000`
*   **Nome:** *Visitante Alpha*
*   **Foco:** Testar as mecânicas normais do app, criação de blocos de tempo, conclusão de metas e fluxo do dashboard.

### **Conta 2: Visitante Beta**
*   **Username:** `tester`
*   **PIN:** `1234`
*   **Nome:** *Visitante Beta*
*   **Foco:** Revisão estrutural, teste de restrições do sistema e networking.

---

## 🛠️ Stack Tecnológica

*   **Framework Principal:** [Next.js 16 (App Router)](https://nextjs.org/)
*   **Biblioteca de UI:** [React 19](https://react.dev/)
*   **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) com PostCSS para processamento de estilos de ponta e animações.
*   **Banco de Dados & ORM:** [Prisma ORM v7](https://www.prisma.io/) com adaptador otimizado para PostgreSQL.
*   **Gerenciamento de Estado:** [Zustand](https://zustand-demo.pmnd.rs/) para estados reativos e compartilhados de forma leve e desacoplada.
*   **Animações:** [Framer Motion](https://www.framer.com/motion/) para transições de página, abertura de modais e reordenação de cartões com sensação premium.
*   **Notificações & Feedback:** [Sonner](https://sonner.emilkowal.ski/) para toasts ricos e não obstrutivos.
*   **Ícones:** [Lucide React](https://lucide.dev/) para glifos consistentes e modernos.

---

## 📂 Arquitetura de Pastas

```text
rotina-flow/
├── prisma/                 # Esquemas de Banco de Dados, Migrações e Sementes (Seed)
│   ├── schema.prisma       # Modelos Prisma (User, Block, Task, SharedAccess)
│   └── seed.ts             # Script de população inicial com contas admin e demo de portfólio
├── public/                 # Arquivos públicos e estáticos
├── src/
│   ├── actions/            # Next.js Server Actions (Processos de Mutação, Validações e Autenticação)
│   │   ├── auth.ts         # Login e Controle de Sessão
│   │   ├── block.ts        # Criação e Exclusão Segura de Blocos
│   │   ├── share.ts        # Criação e Revogação Segura de Links Compartilhados
│   │   └── task.ts         # CRUD, toggles, proteção antispam, filtros e ações em massa
│   ├── app/                # Estrutura de Rotas (Next.js App Router)
│   │   ├── icon.tsx        # Gerador dinâmico de favicon de alta resolução via Next.js OG
│   │   ├── (auth)/         # Grupo de Rotas de Autenticação (Login com PIN)
│   │   ├── (dashboard)/    # Painel Principal e Gerenciador de Tarefas
│   │   └── share/          # Visualização Pública das Rotinas Compartilhadas
│   ├── components/         # Componentes React
│   │   ├── features/       # Componentes de Funcionalidades Específicas (TaskCard, Form, etc.)
│   │   ├── layout/         # Componentes de Estrutura da Página
│   │   └── ui/             # Logo animado e elementos visuais genéricos reutilizáveis
│   ├── lib/                # Configurações de Bibliotecas Externas (Prisma Client)
│   ├── store/              # Lojas globais (Zustand)
│   └── types/              # Tipagens TypeScript Globais
├── docker-compose.yml      # Configuração rápida para rodar PostgreSQL localmente
├── tsconfig.json           # Configuração estrita do compilador TypeScript
└── package.json            # Scripts do projeto e Gerenciamento de Dependências
```

---

## 🚀 Como Rodar o Projeto Localmente

### 1. Clonar e Instalar Dependências

Clone este repositório em sua máquina e instale as dependências com NPM:

```bash
npm install
```

### 2. Configurar o Banco de Dados

Suba uma instância do PostgreSQL. No repositório, há um arquivo `docker-compose.yml` para facilitar a inicialização local com Docker:

```bash
docker compose up -d
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis populadas:

```env
# URL de Conexão com o Banco de Dados
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/rotina_flow?schema=public"
POSTGRES_URL_NON_POOLING="postgresql://admin:adminpassword@localhost:5432/rotina_flow?schema=public"

# Configurações de População Inicial (Seed) - Administradores Iniciais
ADMIN_NAME="Seu Nome"
ADMIN_USERNAME="seu_usuario"
ADMIN_PIN="0000"

ADMIN_NAME2="Segundo Usuário"
ADMIN_USERNAME2="segundo_usuario"
ADMIN_PIN2="1111"
```

### 4. Sincronizar o Prisma e Rodar o Seed

Gere o cliente Prisma, execute as migrações no banco de dados e semeie os dados com os administradores e contas convidadas prontas:

```bash
# Executa as migrações e gera o cliente
npx prisma migrate dev --name init

# Opcional: Se quiser rodar o seed explicitamente para criar as contas iniciais e de testes
npx prisma db seed
```

### 5. Executar o Servidor de Desenvolvimento

Inicie o servidor local de desenvolvimento do Next.js:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador. Use o username `convidado` com o PIN `0000` para entrar imediatamente no modo visitante e testar as funcionalidades com toda a blindagem ativa!

---

## 🎯 Scripts Disponíveis

*   `npm run dev` — Executa o servidor de desenvolvimento reativo local.
*   `npm run build` — Executa a build de produção, gerando o banco de dados Prisma e compilando a aplicação otimizada para o Next.js.
*   `npm run start` — Inicia o servidor Next.js em modo produção pós-build.
*   `npm run lint` — Analisa o código do projeto em busca de erros ou desvios de estilo através do ESLint.
