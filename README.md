# Bistrô Marajó — Cardápio Digital

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

## Visão geral

O **Bistrô Marajó — Cardápio Digital** é um MVP desenvolvido para um restaurante real. A aplicação digitaliza a apresentação do cardápio, organiza os pratos por turno e permite que o cliente monte o pedido antes de encaminhá-lo ao WhatsApp do estabelecimento.

O projeto resolve um problema direto do negócio: substituir um cardápio estático por uma experiência responsiva, atualizável e orientada à conversão. A entrega foi estruturada para gerar valor imediato, com navegação simples, sugestão do chef, carrinho, cálculo do pedido e coleta dos dados de entrega, sem impedir a evolução posterior para uma plataforma integrada.

Entre as funcionalidades já disponíveis estão:

- carregamento e renderização dinâmica do cardápio;
- filtros de pratos por almoço e jantar;
- destaque automático da sugestão do chef;
- carrinho com agrupamento de itens e controle de quantidades;
- cálculo de subtotal, taxa de entrega e total;
- coleta de nome, endereço, pagamento e troco;
- geração da mensagem de pedido para envio pelo WhatsApp;
- layout responsivo, mobile-first e com cuidados de acessibilidade;
- tratamento de falhas no carregamento e de turnos sem itens disponíveis.

> **Nota:** nesta fase, a interface consome [`frontend/js/dados.json`](frontend/js/dados.json). O banco e a camada de persistência já estão preparados no backend, e sua exposição por uma API REST faz parte da próxima evolução.

## Arquitetura do monorepo

O repositório adota uma separação de responsabilidades inspirada em **Three-Tier Architecture**, mantendo apresentação, aplicação e persistência desacopladas. A implementação é incremental: a camada de apresentação e a fundação da camada de dados estão concluídas; a camada de aplicação será consolidada com a API REST.

```text
.
├── frontend/                   # Camada de apresentação
│   ├── assets/                 # Imagens dos pratos
│   ├── css/style.css           # Design system, layout e responsividade
│   ├── js/dados.json           # Fonte de dados do MVP
│   ├── js/script.js            # Renderização, carrinho e regras da interface
│   └── index.html              # Estrutura semântica da aplicação
├── backend/                    # Camadas de aplicação e dados
│   ├── prisma/
│   │   ├── migrations/         # Versionamento do schema do banco
│   │   ├── schema.prisma       # Modelagem de Categoria e Prato
│   │   └── seed.ts             # Carga inicial a partir do JSON do frontend
│   ├── src/server.ts           # Ponto de entrada do backend
│   ├── package.json            # Dependências e scripts do serviço
│   ├── prisma.config.ts        # Configuração do Prisma ORM
│   └── tsconfig.json           # Configuração estrita do TypeScript
├── index.html                  # Redirecionamento para a aplicação web
└── README.md
```

### Responsabilidades por camada

1. **Presentation Tier — `frontend/`:** apresenta o cardápio, gerencia a interação do usuário e o estado do carrinho no navegador.
2. **Application Tier — `backend/`:** concentra o ponto de entrada e receberá as regras de negócio e os endpoints HTTP da API REST.
3. **Data Tier — Prisma + PostgreSQL:** modela categorias e pratos, controla migrations e executa uma carga inicial validada e transacional.

O seed reutiliza a fonte de dados do MVP, valida sua estrutura antes da persistência, agrupa os pratos por categoria e executa a escrita em uma transação. Essa estratégia mantém consistência durante a transição do JSON local para a API.

## Stack tecnológica

### Frontend

- **HTML5:** marcação semântica da interface.
- **CSS3:** layout responsivo e abordagem mobile-first.
- **JavaScript (Vanilla JS):** renderização do cardápio, gerenciamento do carrinho e fluxo de finalização.
- **Fetch API:** leitura assíncrona dos dados do cardápio.
- **JSON:** fonte de dados desacoplada utilizada pelo MVP.
- **Web APIs:** `Intl.NumberFormat`, `URL` e APIs nativas do DOM.
- **Font Awesome 6:** iconografia carregada via CDN.

### Backend

- **Node.js:** ambiente de execução do serviço.
- **TypeScript:** tipagem estática com configuração em modo `strict`.
- **TSX:** execução e watch mode durante o desenvolvimento.
- **Prisma ORM 7.8:** schema, migrations, seed e acesso tipado aos dados.
- **Prisma PostgreSQL Adapter (`@prisma/adapter-pg`):** integração do Prisma Client com o driver PostgreSQL.
- **node-postgres (`pg`):** driver de conexão com o banco.
- **dotenv:** carregamento das variáveis de ambiente.

### Banco de dados

- **PostgreSQL:** banco relacional utilizado pela camada de persistência.
- Modelagem com relacionamento **1:N** entre `Categoria` e `Prato`.
- IDs UUID, preço em `Decimal(10,2)`, disponibilidade, turnos e timestamps de auditoria.
- Migrations versionadas no repositório e seed transacional.

### Infraestrutura e ferramentas

- **Docker:** execução isolada do PostgreSQL em ambiente local.
- **npm:** instalação determinística das dependências por meio do `package-lock.json`.
- **Git/GitHub:** versionamento e distribuição do código-fonte.

## Status atual e roadmap

### ✅ Fase 1 — concluída

- MVP frontend responsivo consumindo dados estruturados em JSON.
- Cardápio dinâmico por turno e sugestão do chef.
- Carrinho, cálculo financeiro e preparação do pedido para WhatsApp.
- Fundação do backend em Node.js e TypeScript.
- PostgreSQL executado em Docker.
- Modelagem, migration e seed com Prisma ORM.

### 🚧 Próximos passos

O projeto passará por uma refatoração para completar a integração entre as camadas:

- criar uma **API REST com Express** para disponibilizar categorias e pratos;
- migrar o frontend de Vanilla JavaScript para **React**;
- substituir o consumo do JSON local pelo consumo da API;
- centralizar regras de negócio e validações na camada de aplicação;
- evoluir o fluxo operacional de pedidos e a administração do cardápio.

## Como executar localmente

### Pré-requisitos

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) e npm
- [Docker](https://www.docker.com/)
- Python 3 para servir os arquivos estáticos do frontend

### 1. Clone o repositório

```bash
git clone https://github.com/eliesdrasdias/bistro-marajo.git
cd bistro-marajo
```

### 2. Inicie o PostgreSQL com Docker

```bash
docker run --name bistro-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=bistromarajo \
  -p 5432:5432 \
  -d postgres
```

Nas próximas execuções, caso o contêiner já exista e esteja parado, use:

```bash
docker start bistro-postgres
```

### 3. Configure e prepare o backend

Acesse o diretório do serviço e instale exatamente as versões registradas no lockfile:

```bash
cd backend
npm ci
```

Crie o arquivo `backend/.env` com a conexão correspondente ao contêiner:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bistromarajo?schema=public"
```

Execute as migrations versionadas e carregue os dados iniciais:

```bash
npx prisma migrate deploy
npm run db:seed
```

> O seed é reconstruído a partir de `frontend/js/dados.json` e substitui os registros existentes nas tabelas `Prato` e `Categoria`.

Para executar o backend em modo de desenvolvimento:

```bash
npm run dev
```

O script utiliza `tsx watch` e, no estágio atual, valida a inicialização do serviço no terminal. Os endpoints HTTP serão adicionados na próxima fase.

### 4. Abra a interface

Em outro terminal, a partir da raiz do repositório, inicie um servidor HTTP local:

```bash
python3 -m http.server 8000
```

Acesse [http://localhost:8000](http://localhost:8000). O arquivo da raiz redirecionará automaticamente para o cardápio em `/frontend/`.

> A interface precisa ser servida por HTTP porque utiliza a Fetch API. A abertura direta pelo protocolo `file://` impede o carregamento do JSON pelas políticas de segurança do navegador.

## Autor

Desenvolvido por **Eliesdras Dias** para o Bistrô Marajó.
