---
id: mongo_e_docker
title: Uso do MongoDB e Configuração do Docker
sidebar_label: MongoDB e Docker
---

# Uso do MongoDB e Configuração do Docker

Este documento detalha as decisões tecnológicas tomadas no projeto, especificamente a utilização do MongoDB apenas para o armazenamento de logs e a configuração detalhada dos containers Docker. Essas escolhas foram feitas visando otimizar a performance, a escalabilidade e a manutenção da aplicação.

---

## Índice

1. [Uso do MongoDB](#uso-do-mongodb)
   - [Razões para Não Utilizar o MongoDB como Data Lake](#razões-para-não-utilizar-o-mongodb-como-data-lake)
   - [Justificativa para Utilizar o MongoDB Apenas para Logs](#justificativa-para-utilizar-o-mongodb-apenas-para-logs)
2. [Configuração do Docker](#configuração-do-docker)
   - [Visão Geral da Configuração](#visão-geral-da-configuração)
   - [Dockerfiles](#dockerfiles)
   - [Orquestração com Docker Compose](#orquestração-com-docker-compose)
   - [Decisões de Configuração](#decisões-de-configuração)
3. [Conclusão](#conclusão)

---

## Uso do MongoDB

### Razões para Não Utilizar o MongoDB como Data Lake

Embora o MongoDB seja uma poderosa base de dados NoSQL, ele não foi escolhido como data lake para este projeto devido aos seguintes motivos:

1. **Escalabilidade de Dados Não Estruturados:**
   - Data lakes geralmente armazenam grandes volumes de dados brutos e não estruturados provenientes de múltiplas fontes. Embora o MongoDB suporte dados não estruturados, sua escalabilidade horizontal pode ser menos eficiente comparada a soluções específicas para data lakes, como o Amazon S3 combinado com serviços de processamento de dados.

2. **Custo de Armazenamento:**
   - Armazenar grandes volumes de dados históricos pode se tornar caro no MongoDB, especialmente quando comparado a soluções de armazenamento de objetos, que oferecem custos mais baixos para armazenamento em massa.

3. **Ferramentas de Processamento e Análise:**
   - Data lakes são frequentemente integrados com ferramentas de processamento de dados em larga escala, como Apache Spark, que podem não se integrar tão facilmente ou de forma tão eficiente com o MongoDB quanto com outras soluções de data lake.

4. **Gerenciamento de Metadados:**
   - A gestão de metadados em um data lake é crucial para a descoberta e governança de dados. Embora o MongoDB possa armazenar metadados, existem ferramentas e soluções mais especializadas que facilitam essa gestão de maneira mais robusta.

### Justificativa para Utilizar o MongoDB Apenas para Logs

Optamos por utilizar o MongoDB exclusivamente para o armazenamento de logs devido às seguintes vantagens:

1. **Performance em Operações de Escrita:**
   - O MongoDB é altamente eficiente para operações de escrita rápida, tornando-o ideal para capturar logs em tempo real sem impactar a performance da aplicação principal.

2. **Flexibilidade no Esquema:**
   - Logs frequentemente possuem estruturas variáveis e campos que podem mudar ao longo do tempo. A natureza schema-less do MongoDB permite armazenar esses logs sem a necessidade de migrações complexas de esquema.

3. **Consultas e Indexação:**
   - O MongoDB oferece poderosas capacidades de indexação e consultas que facilitam a análise e a busca nos logs, permitindo identificar rapidamente padrões, erros e eventos específicos.

4. **Escalabilidade:**
   - Embora não seja um data lake, o MongoDB ainda oferece boa escalabilidade para o volume de logs esperado, garantindo que o sistema possa crescer conforme a necessidade sem perda significativa de performance.

5. **Integração com Ferramentas de Monitoramento:**
   - O MongoDB se integra bem com diversas ferramentas de monitoramento e análise de logs, facilitando a visualização e o gerenciamento dos dados de log.

---

## Configuração do Docker

### Visão Geral da Configuração

A utilização do Docker no projeto visa garantir que todos os componentes da aplicação funcionem de maneira consistente em diferentes ambientes, facilitando o deployment e a escalabilidade. A configuração envolve a criação de containers para o frontend, backend Golang, backend FastAPI e serviços auxiliares como o Redis.

### Dockerfiles

Cada componente principal da aplicação possui seu próprio Dockerfile, responsável por definir o ambiente necessário para sua execução.

1. **Frontend (`app/Dockerfile`):**
   - **Imagem Base:** Utiliza `node:16-alpine` para um ambiente leve e eficiente.
   - **Instalação de Dependências:** Copia `package.json` e `package-lock.json` e executa `npm install` para instalar as dependências.
   - **Build da Aplicação:** Compila a aplicação com `npm run build`.
   - **Execução:** Inicia o frontend com `npm start`, expondo a porta `3000`.

2. **Backend Golang (`backend/golang/Dockerfile`):**
   - **Imagem Base:** Utiliza `golang:1.18-alpine` para um ambiente otimizado para aplicações Go.
   - **Instalação de Dependências:** Copia `go.mod` e `go.sum` e executa `go mod download` para baixar as dependências.
   - **Build da Aplicação:** Compila a aplicação com `go build -o golang_app .`.
   - **Execução:** Inicia o backend com `./golang_app`, expondo a porta `9000`.

3. **Backend FastAPI (`backend/modelo/Dockerfile`):**
   - **Imagem Base:** Utiliza `python:3.9-slim` para um ambiente Python leve.
   - **Instalação de Dependências:** Copia `requirements.txt` e executa `pip install` para instalar as dependências necessárias.
   - **Execução:** Inicia o FastAPI com `uvicorn main:app --host 0.0.0.0 --port 8000`, expondo a porta `8000`.

### Orquestração com Docker Compose

O `docker-compose.yml` é utilizado para orquestrar os diferentes containers, definindo como eles interagem e dependem uns dos outros.

```yaml
version: "3.8"

services:
  # Serviço Front
  frontend:
    build:
      context: ./src/app
    ports:
      - "3000:3000"
    env_file:
      - .env 
    depends_on:
      - backend-golang
    networks:
      - app-network

  # Serviço Backend
  backend-golang:
    build:
      context: ./src/backend/golang/
    ports:
      - "9000:9000"
    env_file:
      - .env 
    depends_on:
      - db 
    networks:
      - app-network

  backend-model:
    build:
      context: ./src/backend/modelo/
    ports:
      - "8000:8000"
    env_file:
      - .env 
    depends_on:
      - db
    networks:
      - app-network

  # Serviço Banco de Dados
  db:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - ./src/backend/dependencies/mongo/data/db:/data/db
    environment:
      - MONGO_INITDB_DATABASE=golang-db
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

```

### Decisões de Configuração

1. **Dependências Entre Serviços:**
   - **`depends_on`:** Garante que os serviços backend sejam iniciados antes do frontend, evitando erros de comunicação devido à indisponibilidade de serviços dependentes.

2. **Variáveis de Ambiente:**
   - **Frontend:** Define `NEXT_PUBLIC_API_URL` apontando para o backend Golang, permitindo que o frontend faça requisições corretamente.
   - **Backend Golang:** Define `FASTAPI_URL` para comunicação interna com o backend FastAPI.
   - **Backend FastAPI:** Define `MAX_MODELS` para controlar o número máximo de modelos armazenados, evitando o uso excessivo de recursos.

3. **Volumes:**
   - **Backend FastAPI:** Monta o diretório de modelos (`./backend/modelo/models`) no container, garantindo que os modelos treinados sejam persistentes mesmo que o container seja reiniciado ou removido.

4. **Portas Expostas:**
   - **Frontend:** Porta `3000` para acessar a aplicação web.
   - **Backend Golang:** Porta `9000` para APIs do backend.
   - **Backend FastAPI:** Porta `8000` para serviços de Machine Learning.
   - **MongoDB:** Porta `27017` para armazenar o banco de dados

5. **Imagens Utilizadas:**
   - **`node:18-alpine`:** Leve e eficiente para aplicações Node.js.
   - **`golang:1.22.4`:** Otimizada para aplicações Go.
   - **`python:3.11`:** Ambiente Python leve para FastAPI.
   - **`mongo:latest`:** Imagem oficial e leve do Redis para gerenciamento de cache.

6. **Build Contexts:**
   - Define claramente os contextos de build para cada serviço, assegurando que o Dockerfile correto seja utilizado e que apenas os arquivos necessários sejam copiados para cada imagem.

7. **Manutenção e Escalabilidade:**
   - A utilização do Docker Compose facilita a manutenção, permitindo iniciar, parar e gerenciar todos os serviços com comandos simples.
   - A separação clara dos serviços permite escalar cada componente de forma independente, caso necessário.

---

## Conclusão

As decisões tecnológicas adotadas neste projeto, como a utilização do MongoDB exclusivamente para logs e a configuração detalhada dos containers Docker, foram fundamentais para garantir uma aplicação robusta, escalável e de fácil manutenção. A escolha do MongoDB para logs assegura uma captura eficiente e flexível de dados de eventos, enquanto a configuração do Docker promove consistência e facilidade de deployment em diferentes ambientes.
---