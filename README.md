# Web Scraper e CRUD com DynamoDB

Este projeto consiste em um web scraper desenvolvido em Node.js utilizando Puppeteer e Cheerio para extrair dados da página de produtos mais vendidos da amazon e armazená-los no banco de dados DynamoDB na AWS. Além disso, o projeto inclui endpoints HTTP para realizar operações CRUD (Create, Read, Update, Delete) nos dados armazenados no DynamoDB com a utilização da API Gateway.

## Tecnologias Utilizadas

- **Node.js**: Plataforma de execução de código JavaScript.
- **Puppeteer**: Biblioteca Node.js para automação de navegação em páginas da web.
- **Cheerio**: Biblioteca Node.js para análise e manipulação de dados HTML.
- **AWS DynamoDB**: Banco de dados NoSQL totalmente gerenciado pela AWS.
- **Serverless Framework**: Framework para desenvolvimento e implantação de aplicativos sem servidor.
- **API Gateway**: Serviço para ser possivel a utilização de endpoints HTTP

## Funcionalidades Principais

1. **Web Scraper**: Extrai dados de uma página da web (por exemplo, produtos mais vendidos em um site de comércio eletrônico) usando Puppeteer e Cheerio.
2. **Armazenamento no DynamoDB**: Armazena os dados extraídos no DynamoDB para persistência.
3. **Operações CRUD**: Fornece endpoints HTTP para criar, ler, atualizar e excluir dados armazenados no DynamoDB.
4. **Implantação sem servidor**: Usa o Serverless Framework para implantar o aplicativo na AWS de forma simples e eficiente.

## Como Usar

1. **Instalação**: Clone este repositório e instale as dependências do Node.js usando `npm install`.
2. **Configuração AWS**: Configure suas credenciais AWS no ambiente local para permitir a comunicação com o DynamoDB.
3. **Implantação**: Use o Serverless Framework para implantar o aplicativo na AWS com `serverless deploy`.
4. **Utilização**: Use os endpoints HTTP fornecidos para acessar as funcionalidades do aplicativo, como execução do web scraper e operações CRUD no DynamoDB.

# Documentação da API

## Descrição
Esta API é responsável por extrair os produtos mais vendidos de cada categoria da página de mais vendidos da Amazon e armazená-los no DynamoDB.

## Endpoints

- **URL BASE**
    - https://pq820yt2wj.execute-api.us-east-1.amazonaws.com/dev

### Scraping de Produtos

#### `GET /scraper`
- **Descrição**: Inicia o processo de extração de dados do site da Amazon e armazena os produtos no DynamoDB. Caso a tabela não esteja criada no dynamoDB, vai ser iniciado o processo de criação da tabela para depois popular com os produtos extraídos da página da amazon 
- **Link endpoint** 
    -  GET - https://pq820yt2wj.execute-api.us-east-1.amazonaws.com/dev/scraper
- **Resposta de Sucesso**: 
  - Código: 200
  - Corpo: `{ "message": "web scraper done successfully" }`
- **Resposta de Erro**:
  - Código: 500
  - Corpo: `{ "error": "Descrição do erro" }`

### Listagem de Produtos

#### `GET /products`
- **Descrição**: Retorna uma lista de todos os produtos armazenados no DynamoDB.
- **Link endpoint** 
    -  GET - https://pq820yt2wj.execute-api.us-east-1.amazonaws.com/dev/products
- **Resposta de Sucesso**:
  - Código: 200
  - Corpo: Lista de objetos JSON representando os produtos
- **Resposta de Erro**:
  - Código: 500
  - Corpo: `{ "error": "Descrição do erro" }`

### Detalhes do Produto

#### `GET /products/{id}`
- **Descrição**: Retorna detalhes de um produto específico com base no ID fornecido.
- **Link endpoint**
    -  GET - https://pq820yt2wj.execute-api.us-east-1.amazonaws.com/dev/products/{productId}
- **Parâmetros de URL**:
  - `id`: id do produto no path do link do endpoint
- **Resposta de Sucesso**:
  - Código: 200
  - Corpo: Objeto JSON representando o produto
- **Resposta de Erro**:
  - Código: 404 se o produto não for encontrado
  - Código: 500 se houver um erro interno

### Exclusão de Produto

#### `DELETE /delete-products`
- **Descrição**: Exclui todos os produtos do banco de dados.
- **Link endpoint**
    -  DELETE - https://pq820yt2wj.execute-api.us-east-1.amazonaws.com/dev/delete-products
- **Resposta de Sucesso**:
  - Código: 200 se os produtos forem excluídos com sucesso
  - Corpo: `{ "message": "Produtos deletados com sucesso" }`
- **Resposta de Erro**:
  - Código: 404 se o produto não for encontrado
  - Código: 500 se houver um erro interno
