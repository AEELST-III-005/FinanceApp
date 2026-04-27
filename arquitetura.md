# Arquitetura do Sistema - FinanceApp

Este documento detalha as decisões técnicas, a stack tecnológica, as integrações e os padrões arquiteturais utilizados no desenvolvimento do FinanceApp.

## 1. Stack Tecnológica (Tech Stack)

O projeto é dividido em uma arquitetura cliente-servidor moderna, utilizando as seguintes tecnologias:

### Backend
- **Linguagem:** Python 3.12
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) - Escolhido pela sua alta performance, suporte nativo a operações assíncronas e documentação automática (Swagger).
- **ORM:** [SQLAlchemy](https://www.sqlalchemy.org/) - Utilizado para abstração da camada de banco de dados e mapeamento objeto-relacional.
- **Validação de Dados:** Pydantic (integrado ao FastAPI) para definição de schemas e DTOs.
- **Servidor Web:** Uvicorn.

### Frontend
- **Framework:** [React](https://reactjs.org/) (v18)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first para desenvolvimento rápido de interfaces responsivas.
- **Ícones:** Lucide React.
- **Gráficos:** Recharts - Para visualização de dados financeiros no Dashboard.
- **Roteamento:** React Router.

### Banco de Dados
- **PostgreSQL 15:** Banco de dados relacional robusto, escolhido pela sua confiabilidade e suporte a tipos de dados complexos.

---

## 2. Decisões Arquiteturais e Padrões

### Padrão de Camadas (Backend)
O backend segue uma arquitetura baseada em camadas para garantir a separação de responsabilidades:

1.  **Controllers (Routes):** Responsáveis por receber as requisições HTTP, validar os parâmetros de entrada e retornar as respostas ao cliente.
2.  **Services:** Camada de lógica de negócio. Concentra as regras de domínio e coordena a comunicação entre repositórios e outras utilidades.
3.  **Repositories (Repository Pattern):** Camada de abstração de dados. Encapsula toda a lógica de consulta ao banco de dados utilizando SQLAlchemy, facilitando a manutenção e possíveis trocas de tecnologia de persistência.
4.  **Models:** Definição das tabelas do banco de dados (Entidades).
5.  **DTOs (Data Transfer Objects):** Schemas Pydantic que definem o formato dos dados que trafegam entre o cliente e o servidor, garantindo validação e segurança.

### Frontend
- **Componentização:** A interface é construída através de componentes React reutilizáveis.
- **Hooks:** Utilização de Hooks customizados para gerenciamento de estado e chamadas de API (serviços).
- **CSS Utility-First:** Uso intensivo de Tailwind para manter o código CSS enxuto e escalável diretamente nos componentes.

---

## 3. Integrações e Docker

O ambiente de desenvolvimento e produção é orquestrado via **Docker** e **Docker Compose**, garantindo que o sistema funcione de forma idêntica em qualquer máquina.

### Serviços no Docker Compose:
- **`db` (PostgreSQL):** Container de banco de dados persistente utilizando volumes para não perder dados entre reinicializações.
- **`backend`:** 
    - Build baseado no `Dockerfile` dentro da pasta `/backend`.
    - Hot-reload ativado para desenvolvimento através do comando `uvicorn --reload`.
    - Comunica-se com o banco de dados via variáveis de ambiente (`DATABASE_URL`).
- **`frontend`:**
    - Build baseado no `Dockerfile` na pasta `/frontend`.
    - Mapeamento de volumes para refletir alterações de código em tempo real.

### Rede (Networking)
Todos os serviços estão conectados em uma rede interna chamada `finance_app`, permitindo que o backend acesse o banco de dados usando o nome do serviço (`db`) como host.

---

## 4. Banco de Dados no Backend e Frontend

### No Backend (Persistência)
O banco de dados PostgreSQL é o "single source of truth". As tabelas principais incluem:
- **Categories:** Armazena categorias de gastos (nome, cor, ícone).
- **Transactions:** Registra movimentações financeiras vinculadas a categorias, com data, valor e descrição.

### No Frontend (Estado)
O frontend consome a API REST do backend e gerencia o estado localmente. Não há um banco de dados local (como IndexedDB) persistente, mas sim um cache em memória e gerenciamento de estado para garantir uma navegação fluida.

## 5. Código Aberto e Contribuição

O FinanceApp é um projeto **Open Source**, incentivando a colaboração da comunidade. O fluxo de desenvolvimento segue as melhores práticas de projetos abertos:

- **Pull Requests (PRs):** Todas as novas funcionalidades, correções de bugs ou melhorias devem ser submetidas via Pull Requests. 
- **Revisão:** Os PRs passam por um processo de revisão e, obrigatoriamente, pela execução automática da esteira de Integração Contínua.

---

## 6. Integração Contínua (CI)

O projeto utiliza o **GitHub Actions** para garantir a qualidade do código e a estabilidade do sistema a cada alteração. O workflow de CI (`ci.yml`) é disparado automaticamente em cada Pull Request e inclui os seguintes estágios:

1.  **Linting e Formatação:**
    - Utiliza o **Ruff** para garantir que o código Python siga os padrões de estilo (PEP 8) e para identificar potenciais erros programáticos de forma estática.
2.  **Testes Unitários:**
    - Executa testes isolados das funções e classes do backend utilizando **Pytest**, garantindo que as unidades de lógica de negócio funcionem conforme o esperado.
3.  **Testes de Integração / End-to-End (E2E):**
    - Valida o fluxo completo da aplicação, garantindo que a integração entre as camadas (Controller, Service, Repository) e o banco de dados esteja operando corretamente.
    - No GitHub Actions, esses testes asseguram que mudanças recentes não quebraram funcionalidades existentes (prevenção de regressão).
