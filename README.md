#  Bistrô Marajó | Sistema de Cardápio Dinâmico

 **Status do Projeto:** Em evolução para Full-Stack. (Fase 1: UI Concluída | Fase 2: Construção da API Backend em andamento).

##  Sobre o Projeto
Aplicação em desenvolvimento para resolver um problema real de negócio local: a modernização do atendimento do **Bistrô Marajó**. 

O objetivo inicial foi substituir processos manuais e o envio de mensagens estáticas por uma interface web limpa e responsiva. Agora, o sistema está evoluindo com a construção de uma API RESTful no Backend para tornar o gerenciamento de pratos, preços e disponibilidade 100% dinâmico e autônomo.

🔗 **[Acesse a Interface (Fase 1)](https://eliesdrasdias.github.io/bistro-marajo/)**

## 🛠️ Tecnologias do Ecossistema

**Backend (Fase 2 - Em Desenvolvimento):**
* **Node.js & TypeScript:** Construção da API REST com tipagem estática para maior previsibilidade do código.
* **Banco de Dados (SQL):** Modelagem estruturada das entidades do restaurante.

**Frontend (Fase 1 - Concluída):**
* **HTML5 & CSS3:** Estruturação semântica, variáveis CSS, Flexbox e Grid Layout.
* **JavaScript:** Manipulação de datas em tempo real (indicador de Aberto/Fechado) e lógica de interface.

**Infraestrutura:**
* **Git & GitHub:** Versionamento de código e *Deploy* da interface via GitHub Pages.

## 🗺️ Roadmap de Desenvolvimento (Backend)
* [ ] Modelagem do banco de dados (Entidades: Pratos, Categorias, Status).
* [ ] Criação de rotas da API REST (GET, POST, PUT, DELETE) com Express.
* [ ] Implementação de tipagem rigorosa de dados (Interfaces/Types) com TypeScript.
* [ ] Refatoração do Frontend para consumir os dados dinâmicos da API via `fetch`.

## ✨ Funcionalidades Atuais
* Interface 100% responsiva focada na experiência do usuário (UX) em dispositivos móveis.
* Catálogo digital visual de pratos.
* Indicador dinâmico de horário de funcionamento.
* Otimização do fluxo de contato e pedidos direto para o WhatsApp do restaurante.

## 👨‍💻 Autor
**Eliesdras Dias**
* [LinkedIn](https://www.linkedin.com/in/eliesdras/)
* [GitHub](https://github.com/eliesdrasdias)

## ⚙️ Como executar a interface localmente

```bash
# Clone este repositório
git clone [https://github.com/eliesdrasdias/bistro-marajo.git](https://github.com/eliesdrasdias/bistro-marajo.git)

# Acesse a pasta do projeto no terminal
cd bistro-marajo

# Execute o arquivo index.html no seu navegador ou via Live Server no VS Code
