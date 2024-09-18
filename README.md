# Plataforma de Previsão de Preços de Criptomoedas

Esta é uma plataforma de previsão de preços de criptomoedas que utiliza modelos de IA para prever os valores de criptos. A arquitetura do sistema é composta por três componentes principais:

1. **Frontend**: Desenvolvido com Next.js, fornece uma interface amigável para exibir os preços previstos das criptomoedas e interagir com o backend.
2. **Backend**: Desenvolvido em Golang, é responsável pela lógica de negócios e pela comunicação entre o frontend e o serviço de modelo.
3. **Serviço de Modelos**: Implementado com FastAPI, este serviço contém o modelo de IA para a previsão de preços de criptomoedas.
4. **Base de Dados**: Utiliza MongoDB para armazenar os dados necessários para treinar os modelos.

Todo o projeto é containerizado usando Docker para facilitar o deploy.

## Sumário
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Uso](#uso)
- [Configuração do Docker](#configuração-do-docker)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Tecnologias

- **Frontend**: Next.js (Framework React)
- **Backend**: Golang
- **Serviço de Modelos**: FastAPI (baseado em Python)
- **Base de Dados**: MongoDB
- **Containerização**: Docker

## Estrutura do Projeto

Segue abaixo a estrutura do projeto:

``` bash
├── app / # Frontend em Next.js
│   ├── Dockerfile
│   ├── README.md
│   ├── next-env.d.ts
│   ├── next.config.mjs
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── public
│   ├── src
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── backend 
    ├── dependencies / # Base de dados em MongoDB
    ├── golang / # Backend em Golang
    └── modelo / # Serviço de Modelos em FastAPI
```


## Instalação e Configuração

### Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas em seu sistema:
- **Docker**: [Instalar Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Instalar Docker Compose](https://docs.docker.com/compose/install/)

### Clonando o Repositório

```bash
git clone https://github.com/AntonioArtimonte/Ponderada-Modelo
cd seu-repositorio
```

### Executando a Aplicação

O projeto utiliza o Docker Compose para gerenciar e executar os diferentes componentes (frontend, backend e serviço de modelo). Para iniciar todo o sistema, execute:

```bash
docker-compsoe up --build
```

Este comando irá:

- Construir e iniciar o frontend em Next.js
- Construir e iniciar o backend em Golang
- Construir e iniciar o serviço FastAPI com o modelo

Uma vez que todos os serviços estejam em execução, você pode acessar o frontend em `http://localhost:3000`.

## Uso

**Frontend (Next.js)**

- Navegue até `http://localhost:3000` para acessar a interface do usuário.
- O frontend irá se comunicar com o backend para exibir os preços das criptomoedas previstas.

**Backend (Golang)**

- O backend é responsável por gerenciar as solicitações de API do frontend e interagir com o serviço FastAPI para previsões.
- Ele roda em `http://localhost:8080`.

**Serviço de Modelos (FastAPI)**

- O serviço FastAPI fornece o modelo de IA para previsões de preços de criptomoedas.
- Ele roda em `http://localhost:8000`.

**Base de Dados (MongoDB)**

- O MongoDB é utilizado para armazenar os dados necessários para treinar os modelos.
- Ele roda em `http://localhost:27017`.

## Licença

Este projeto é licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.