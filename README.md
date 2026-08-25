# Bistrô Marajó | Cardápio Digital

MVP de um cardápio digital responsivo para o **Bistrô Marajó**. A aplicação apresenta pratos de forma dinâmica, com navegação por período e uma experiência pensada primeiro para dispositivos móveis.

## Sobre o Projeto

O projeto começou como uma interface estática em HTML, CSS e JavaScript puro. Nesta evolução, o conteúdo do cardápio passou a ser carregado de um arquivo JSON, permitindo atualizar pratos, preços, imagens e disponibilidade por turno sem alterar a estrutura da página.

Não há frameworks ou backend nesta versão: toda a experiência é executada no navegador com APIs nativas da web.

## Funcionalidades

- Renderização dinâmica dos pratos a partir de [`js/dados.json`](js/dados.json).
- Abas para alternar e filtrar o cardápio entre **Almoço** e **Jantar**.
- Exibição de pratos em mais de um período, conforme o campo `turno` do JSON.
- Seção **Sugestão do Chef** gerada dinamicamente pelo campo `pratoDoDia`.
- Tratamento de falha no carregamento dos dados e de períodos sem pratos cadastrados.
- Formatação de valores em Real brasileiro (`BRL`) com `Intl.NumberFormat`.
- Layout responsivo e mobile-first.
- Foco visível nas abas para melhor navegação por teclado.

## Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- JSON
- Fetch API

## Estrutura do Projeto

```text
.
├── assets/             # Imagens dos pratos
├── css/
│   └── style.css        # Estilos e responsividade
├── js/
│   ├── dados.json       # Fonte de dados do cardápio
│   └── script.js        # Renderização, abas e consumo do JSON
├── index.html
└── README.md
```

## Como Executar

Como o projeto usa a Fetch API para carregar o arquivo JSON, ele deve ser servido por um **servidor HTTP local**. Abrir `index.html` diretamente pelo protocolo `file://` fará o navegador bloquear a requisição por regras de CORS.

### Opção 1: Live Server (VS Code)

1. Abra a pasta do projeto no VS Code.
2. Instale a extensão **Live Server**, caso ainda não a tenha.
3. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.
4. Acesse o endereço exibido no navegador, normalmente `http://127.0.0.1:5500`.

### Opção 2: servidor HTTP com Python

No terminal, dentro da pasta do projeto, execute:

```bash
python3 -m http.server 8000
```

Depois, abra no navegador:

```text
http://localhost:8000
```

## Estrutura dos Dados

Cada item em `js/dados.json` segue esta estrutura:

```json
{
  "id": 1,
  "nome": "Nome do prato",
  "descricao": "Descrição do prato.",
  "preco": 25.0,
  "turno": ["almoco", "jantar"],
  "categoria": "comida_normal",
  "imagem": "assets/imagem-do-prato.jpg",
  "pratoDoDia": false
}
```

Para incluir um prato, basta adicionar um novo objeto ao array. O campo `turno` define em quais abas o item será exibido, e `pratoDoDia` define a Sugestão do Chef.

## Próximos Passos

- Desenvolver um backend para servir os dados do cardápio.
- Criar uma área administrativa para gerenciar pratos, preços, disponibilidade e sugestão do dia.
- Integrar o fluxo de pedidos ao WhatsApp do restaurante.

## Autor

Desenvolvido por **Eliesdras Dias** para o Bistrô Marajó.
