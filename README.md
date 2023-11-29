# Daily Diet API

Consiste em uma API Rest para uma aplicação onde o usuário pode registrar suas refeições diárias para dados nutricionais e controle melhor de sua dieta. 

## 🚀 Começando

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.

### 📋 Regras da Aplicação

  - [x] Deve ser possível criar um usuário
  - [x] Deve ser possível identificar o usuário entre as requisições
  - [x] Deve ser possível registrar uma refeição feita, com as seguintes informações:  
      - Nome
      - Descrição
      - Data e Hora
      - Está dentro ou não da dieta
  - [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
  - [x] Deve ser possível apagar uma refeição
  - [x] Deve ser possível listar todas as refeições de um usuário
  - [x] Deve ser possível visualizar uma única refeição
  - [x] Deve ser possível recuperar as métricas de um usuário
      - Quantidade total de refeições registradas
      - Quantidade total de refeições dentro da dieta
      - Quantidade total de refeições fora da dieta
      - Melhor sequência por dia de refeições dentro da dieta
  - [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

### 🔧 Instalação

Uma série de exemplos passo-a-passo que informam o que você deve executar para ter um ambiente de desenvolvimento em execução.

Clone o projeto:

```
git clone https://github.com/enzopavanelli/daily-diet-api.git
```

Instalar as dependências do projeto:

```
npm install
```

Rodar as migrations do projeto para criar o banco de dados:

```
npm run knex -- migrate:latest
```

Rode o projeto no ambiente de desenvolvimento:

```
npm run dev
```

## ✈️ Rotas da aplicação

- Criar novo usuário
```
POST /users
```

- Listar todos os usuários
```
POST /users
```

- Criar novo registro de refeição
```
POST /meals
```

- Listar todas refeições registradas pelo usuário
```
GET /meals
```

- Listar uma refeição específica registrada pelo usuário
```
GET /meals/:id
```

- Mostrar um resumo geral das refeições cadastradas pelo usuário (total de refeições, refeições dentro da dieta e refeições fora da dieta)
```
GET /meals/summary
```

- Deletar uma refeição cadastrada
```
DELETE /meals/:id
```

- Editar uma refeição cadastrada
```
PUT /meals/:id
```

## ⚙️ Executando os testes

Teste e2e para todas as rotas do projeto, para rodar os testes basta rodar o comando:

```
npm run test
```

## 🛠️ Construído com

* [Fastify](https://fastify.dev/docs/latest/) 
* [Node.Js](https://nodejs.org/en/docs) 
* [Typescript](https://www.typescriptlang.org/docs/)
* [Vitest](https://vitest.dev/)
  


---
⌨️ com ❤️ por [Enzo Pavanelli](https://github.com/enzopavanelli) 😊
