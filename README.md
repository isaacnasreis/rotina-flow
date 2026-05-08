# 🌌 Flow State — Gerenciador de Rotina de Alta Performance

O **Flow State** (Rotina Flow) é um gerenciador de rotinas diárias e blocos de tempo ultradinamizado, desenvolvido para profissionais, criadores e estudantes que buscam alcançar e manter o estado de fluxo (*flow state*) em suas atividades diárias.

Com uma interface moderna, minimalista e imersiva baseada em um tema escuro profundo e acentos neon vibrantes, o aplicativo ajuda a segmentar o dia de forma intuitiva, focando na **vibração e nível de energia** necessários para cada tarefa.

---

## ✨ Funcionalidades Principais

*   **⚡ Categorização por Nível de Energia (Vibração):** Organize suas tarefas com base no seu estado mental e energia necessários. Cada categoria possui sua própria aura, brilho e borda colorida dinâmica no aplicativo:
    *   `Foco Profundo` *(Fuchsia)* — Atividades que exigem concentração absoluta.
    *   `Fluxo Criativo` *(Cyan)* — Atividades voltadas para inovação, design e ideias.
    *   `Recarregar` *(Emerald)* — Intervalos, refeições e autocuidado para recarregar as energias.
    *   `Conectar` *(Orange)* — Reuniões, chamadas ou interações com outras pessoas.
    *   `Operacional` *(Slate)* — Tarefas administrativas e rotineiras de baixo esforço cognitivo.
*   **📂 Blocos de Rotina Dinâmicos:** Segmente suas tarefas em blocos personalizados (como *Manhã*, *Tarde*, *Foco*, *Lazer*).
    *   *Segurança de Dados:* Ao excluir um bloco personalizado, as tarefas associadas a ele **não são perdidas**; elas retornam automaticamente para o bloco padrão **"Geral"**.
*   **⏱️ Smart Time Manager (Controle Inteligente de Tempo):**
    *   Defina horários de início e término com rapidez usando seletores de duração ágeis (`15m`, `30m`, `1h`, `2h` ou `Livre`).
    *   Edição direta na listagem através de inputs de texto reativos com auto-save imediato.
*   **🔗 Link de Compartilhamento Zero-Auth:** Compartilhe sua rotina de hoje de forma rápida e segura. O sistema gera um token de acesso exclusivo que permite que qualquer pessoa visualize sua rotina em modo **leitura (Read-Only)** sem precisar criar uma conta ou fazer login.
*   **🔑 Autenticação Segura via PIN:** Um fluxo de login limpo e direto usando o seu nome de usuário e um **PIN numérico de 4 dígitos** de sincronização rápida.

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
│   └── seed.ts             # Script de população inicial do banco de dados (Prisma v7)
├── public/                 # Arquivos públicos e estáticos
├── src/
│   ├── actions/            # Next.js Server Actions (Processos de Mutação e Autenticação)
│   │   ├── auth.ts         # Login e Controle de Sessão
│   │   ├── block.ts        # Criação e Exclusão de Blocos
│   │   ├── share.ts        # Criação e Revogação de Links Compartilhados
│   │   └── task.ts         # CRUD e toggles de tarefas
│   ├── app/                # Estrutura de Rotas (Next.js App Router)
│   │   ├── (auth)/         # Grupo de Rotas de Autenticação (Login com PIN)
│   │   ├── (dashboard)/    # Painel Principal e Gerenciador de Tarefas
│   │   └── share/          # Visualização Pública das Rotinas Compartilhadas
│   ├── components/         # Componentes React
│   │   ├── features/       # Componentes de Funcionalidades Específicas (TaskCard, Form, etc.)
│   │   ├── layout/         # Componentes de Estrutura da Página
│   │   └── ui/             # Elementos Visuais Genéricos e Reutilizáveis
│   ├── lib/                # Configurações de Bibliotecas Externas (Prisma Client)
│   ├── store/              # Lojas globais (Zustand)
│   └── types/              # Tipagens TypeScript Globais
├── docker-compose.yml      # Configuração rápida para rodar PostgreSQL localmente
├── tsconfig.json           # Configuração estrita do compilador TypeScript
└── package.json            # Scripts do projeto e Gerenciamento de Dependências
```

---

## 🗄️ Modelo de Dados (Prisma Schema)

O banco de dados é estruturado em quatro modelos principais altamente interligados:

1.  **`User`**: Armazena as informações do perfil, o username exclusivo e o **PIN de segurança criptografado/persistido**.
2.  **`Block`**: Agrupamentos e abas de tempo (ex: *Manhã*, *Tarde*, *Trabalho*) que pertencem a um usuário e ordenam as tarefas.
3.  **`Task`**: Detalhes da rotina, contendo o título, descrição, horário de início, horário de término, categoria de energia (`category`) e status de conclusão (`isCompleted`). Se o bloco contêiner for deletado, `blockId` é atualizado para `null` (SetNull) garantindo retenção de dados.
4.  **`SharedAccess`**: Controla as chaves exclusivas de acesso público (`accessToken`) para as rotinas de visualização livre de autenticação.

---

## 🚀 Como Rodar o Projeto Localmente

### 1. Clonar e Instalar Dependências

Clone este repositório em sua máquina e instale as dependências com NPM:

```bash
npm install
```

### 2. Configurar o Banco de Dados

Suba uma instância do PostgreSQL (ou use seu serviço em nuvem favorito). No repositório, há um arquivo `docker-compose.yml` para facilitar a inicialização local com Docker:

```bash
docker compose up -d
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env` (ou copie o `.env.local`) na raiz do projeto com as seguintes variáveis populadas:

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

Gere o cliente Prisma, execute as migrações no banco de dados e semeie os dados com os administradores configurados no seu `.env`:

```bash
# Executa as migrações e gera o cliente
npx prisma migrate dev --name init

# Opcional: Se quiser rodar o seed explicitamente para criar as contas iniciais
npx prisma db seed
```

### 5. Executar o Servidor de Desenvolvimento

Agora basta iniciar o servidor local de desenvolvimento do Next.js:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para experimentar o **Flow State**. Use as credenciais configuradas no seu `.env` para fazer o login por PIN!

---

## 🎯 Scripts Disponíveis

*   `npm run dev` — Executa o servidor de desenvolvimento reativo local.
*   `npm run build` — Executa a build de produção, gerando o banco de dados Prisma e compilando a aplicação otimizada para o Next.js.
*   `npm run start` — Inicia o servidor Next.js em modo produção pós-build.
*   `npm run lint` — Analisa o código do projeto em busca de erros ou desvios de estilo através do ESLint.

