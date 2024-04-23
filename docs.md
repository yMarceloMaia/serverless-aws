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
