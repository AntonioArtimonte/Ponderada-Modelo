# Previsão de Preços de Criptomoedas

Bem-vindo ao **Projeto de Previsão de Preços de Criptomoedas**! Este projeto visa prever os preços futuros de diversas criptomoedas utilizando modelos de Machine Learning avançados, integrados em uma aplicação web interativa. A aplicação é composta por um frontend desenvolvido em **Next.js** e **React**, dois backends em **Golang** e **FastAPI**, e utiliza **Docker** para containerização e orquestração dos serviços.

## Índice

- [Visão Geral](#visão-geral)
- [Características](#características)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Utilizar](#como-utilizar)
- [Dashboard](#dashboard)
- [Retreinamento do Modelo](#retreinamento-do-modelo)
- [Armazenamento de Logs](#armazenamento-de-logs)
- [Histórico de Desenvolvimento](#histórico-de-desenvolvimento)
- [Contribuição](#contribuição)
- [Contato](#contato)

---

## Visão Geral

Este projeto tem como objetivo principal fornecer uma ferramenta eficiente para prever os preços futuros de criptomoedas, auxiliando investidores e entusiastas a tomar decisões informadas. A aplicação combina tecnologias robustas como **Golang** para o backend principal, **FastAPI** para operações de Machine Learning, e **Next.js** com **React** para um frontend dinâmico e responsivo. **Docker** é utilizado para garantir a consistência do ambiente de desenvolvimento e facilitar o deployment.

É possível acessar está aplicação "deployada" no seguinte link: [Ponderada-Modelo]()

---

## Características

- **Previsão de Preços:** Utiliza modelos LSTM com blocos de atenção para prever preços futuros de criptomoedas.
- **Interface Intuitiva:** Frontend desenvolvido com Next.js e React, proporcionando uma experiência de usuário amigável.
- **API RESTful:** Backend em Golang e FastAPI disponibilizam endpoints para interagir com o modelo de previsão.
- **Dashboard Interativo:** Visualização de resultados e métricas de desempenho do modelo.
- **Retreinamento Contínuo:** Planejamento para retreinamento do modelo com novos dados, garantindo previsões sempre atualizadas.
- **Armazenamento de Logs:** Utilização do MongoDB para armazenar logs de uso do sistema.
- **Containerização com Docker:** Facilita o deployment e garante a consistência entre diferentes ambientes.

---

## Tecnologias Utilizadas

- **Frontend:**
  - [Next.js](https://nextjs.org/)
  - [React](https://reactjs.org/)
  - [Tailwind CSS](https://tailwindcss.com/)

- **Backend:**
  - [Golang](https://golang.org/)
  - [FastAPI](https://fastapi.tiangolo.com/)
  - [Redis](https://redis.io/)
  - [MongoDB](https://www.mongodb.com/)

- **Base de Dados:**
    - [MongoDB](https://www.mongodb.com/)

- **Machine Learning:**
  - [TensorFlow](https://www.tensorflow.org/)
  - [Keras](https://keras.io/)
  - [Scikit-learn](https://scikit-learn.org/)

- **DevOps:**
  - [Docker](https://www.docker.com/)
  - [Docker Compose](https://docs.docker.com/compose/)

- **Outras Bibliotecas:**
  - [yfinance](https://pypi.org/project/yfinance/)
  - [Pandas](https://pandas.pydata.org/)
  - [NumPy](https://numpy.org/)
  - [Matplotlib](https://matplotlib.org/)
  - [Seaborn](https://seaborn.pydata.org/)
  - [Plotly](https://plotly.com/python/)

---

## Estrutura do Projeto

A estrutura de diretórios do projeto é organizada de forma a separar claramente os diferentes componentes da aplicação, facilitando a manutenção e escalabilidade.

```bash
Ponderada-Modelo/
├── app
│   ├── Dockerfile
│   ├── README.md
│   ├── next-env.d.ts
│   ├── next.config.mjs
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── public
│   ├── src
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── backend
│   ├── dependencies
│   ├── golang
│   │   └── [código-fonte do backend Golang]
│   └── modelo
│       ├── Dockerfile
│       ├── main.py
│       ├── requirements.txt
│       └── [outros arquivos do backend FastAPI]
├── notebook
│   └── Notebook_Ponderada.ipynb
├── docker-compose.yml
└── trained_cryptos.json
```

### Descrição dos Diretórios Principais

- **app:** Contém todo o código relacionado ao frontend, incluindo componentes, páginas e configurações.
- **backend:** Contém o código dos backends em Golang e FastAPI.
  - **golang:** Código fonte do backend em Golang.
  - **modelo:** Código fonte do backend FastAPI, incluindo o modelo de Machine Learning.
- **notebook:** Contém notebooks Jupyter utilizados para o desenvolvimento e treinamento do modelo de Machine Learning.
- **docker-compose.yml:** Arquivo de orquestração dos containers Docker.
- **trained_cryptos.json:** Arquivo JSON que rastreia os modelos de criptomoedas treinados.

---

## Instalação e Configuração

### Pré-requisitos

Antes de iniciar, certifique-se de que os seguintes componentes estão instalados em sua máquina:

- **Docker:** [Instalar Docker](https://docs.docker.com/get-docker/)
- **Docker Compose:** [Instalar Docker Compose](https://docs.docker.com/compose/install/)
- **Git:** [Instalar Git](https://git-scm.com/downloads)

### Passo a Passo para Rodar

1. **Clonar o Repositório:**

   ```bash
   git clone https://github.com/AntonioArtimonte/Ponderada-Modelo
   cd Ponderada-Modelo
   ```

2. **Configurar Variáveis de Ambiente:**

   Crie um arquivo `.env` na raiz do projeto (se ainda não existir) e defina as variáveis necessárias.

   ```env
   NEXT_PUBLIC_API_URL=http://backend-golang:9000/api
   FASTAPI_URL=http://backend-fastapi:8000
   ```

3. **Construir e Iniciar os Containers:**

   Utilize o Docker Compose para construir as imagens e iniciar os serviços.

   ```bash
   docker-compose up --build
   ```

   - **Opção para Rodar em Segundo Plano:**

     ```bash
     docker-compose up --build -d
     ```

4. **Acessar a Aplicação:**

   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend Golang:** [http://localhost:9000](http://localhost:9000)
   - **Backend FastAPI:** [http://localhost:8000/docs](http://localhost:8000/docs) *(Documentação interativa do FastAPI ABABA ESQUECI DISTO AHSDHASDHASHDAHSD)*

---

## Como Utilizar

1. **Treinar um Modelo:**

   - Navegue até o frontend em [http://localhost:3000](http://localhost:3000).
   - Selecione a criptomoeda desejada e defina as datas de início e fim para o treinamento.
   - Clique em "Iniciar Treinamento" para treinar o modelo.
   - Monitore o progresso através do **Dashboard**.

2. **Retreinar um Modelo:**

   - Para criptomoedas já treinadas, o botão "Retreinar Modelo" estará disponível.
   - Clique no botão e confirme o retreinamento para atualizar o modelo com novos dados.

3. **Obter Previsões:**

   - Utilize o endpoint `/api/predict` na API FastAPI ou interaja através do **Dashboard** para visualizar as previsões de preços futuros.

---

## Dashboard

O dashboard oferece uma visualização interativa dos resultados das previsões do modelo. Principais funcionalidades incluem:

- **Gráficos de Preços:** Visualização dos preços históricos e das previsões futuras.
- **Métricas de Desempenho:** Exibição de métricas como `Test Loss` e `Test MAE`.
- **Interatividade:** Ferramentas para selecionar diferentes criptomoedas, ajustar parâmetros de previsão e comparar cenários.

### Gerar Gráficos

Utilize os notebooks fornecidos para gerar os gráficos necessários:

1. **Exploração de Dados:**

   - `notebook/Graficos_Exploracao_Dados.ipynb`

2. **Resultados do Modelo:**

   - `notebook/Graficos_Dashboard.ipynb`

3. **Logs de Uso:**

   - `notebook/Graficos_Logs.ipynb`

4. **Histórico de Commits:**

   - `notebook/Graficos_Historico_Commits.ipynb`

Execute os notebooks no Google Colab ou em seu ambiente Jupyter preferido para gerar e salvar os gráficos na pasta `./assets/`.

---

## Retreinamento do Modelo

Para manter o modelo atualizado com os dados mais recentes, implementamos um plano de retreinamento contínuo:

- **Automatização com Celery:**
  - Utilizamos **Celery** para gerenciar tarefas assíncronas de retreinamento.
  - **Redis** atua como broker para as filas de tarefas.

- **Endpoints de Retreinamento:**
  - `/api/retrain`: Endpoint para iniciar o retreinamento do modelo para uma criptomoeda específica.

- **Orquestração com Docker Compose:**
  - Serviços `celery` e `celery-beat` são definidos no `docker-compose.yml` para gerenciar as tarefas de retreinamento.

---

## Armazenamento de Logs

Utilizamos **MongoDB** para armazenar logs de uso do sistema, garantindo que todas as operações significativas sejam registradas para auditoria e análise.

### Por Que Não Utilizar o MongoDB como Data Lake

Embora o MongoDB seja uma poderosa base de dados NoSQL, ele não foi escolhido como data lake devido a:

- **Escalabilidade de Dados Não Estruturados:** Soluções específicas como Amazon S3 são mais eficientes para data lakes.
- **Custo de Armazenamento:** Armazenar grandes volumes de dados históricos pode ser mais caro no MongoDB.
- **Ferramentas de Processamento Especializadas:** Integrações com ferramentas como Apache Spark são mais eficientes com outras soluções.
- **Gerenciamento de Metadados:** Ferramentas especializadas oferecem funcionalidades mais robustas para gestão de metadados.

### Justificativa para Utilizar o MongoDB Apenas para Logs

- **Performance em Operações de Escrita:** Ideal para capturar logs em tempo real sem impactar a performance.
- **Flexibilidade no Esquema:** Permite armazenar logs com estruturas variáveis.
- **Facilidade de Consulta e Indexação:** Facilita a análise e busca nos logs.
- **Escalabilidade:** Suporta o crescimento do volume de logs de forma eficiente.

### Configuração do MongoDB

O MongoDB é configurado no `docker-compose.yml` e está disponível na porta `27017`.

---

## Histórico de Desenvolvimento

Mantemos um **histórico de desenvolvimento detalhado** no repositório do projeto, utilizando práticas de **controle de versão com Git** para garantir transparência e facilitar a colaboração.

### Principais Práticas Adotadas

- **Commits Frequentes:** Com mensagens claras e descritivas.
- **Branches para Funcionalidades:** `feature`, `bugfix`, `release`.
- **Pull Requests e Revisões de Código:** Garantem a qualidade e integridade do código.
- **Documentação Atualizada:** Inclui guias de instalação, manuais de uso e notas de versão.
- **Issues e Projetos no GitHub:** Para gerenciar tarefas, bugs e solicitações de melhorias.

### Visualização do Histórico de Commits

Execute o script fornecido no notebook `Graficos_Historico_Commits.ipynb` para gerar gráficos que ilustram o histórico de commits do projeto.

---

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests para melhorar este projeto.

### Como Contribuir

1. **Fork o Repositório**
2. **Crie uma Branch para sua Feature:** `git checkout -b feature/nova-feature`
3. **Faça Commit das suas Alterações:** `git commit -m 'Adiciona nova feature'`
4. **Faça Push para a Branch:** `git push origin feature/nova-feature`
5. **Abra um Pull Request**


---

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---