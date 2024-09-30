---
id: avaliacao
title: Avaliação do Projeto
sidebar_label: Avaliação
---

# Avaliação do Projeto

Este documento aborda os principais critérios de avaliação do projeto de previsão de preços de criptomoedas. Cada seção detalha como o projeto atende aos requisitos estabelecidos, destacando as etapas de exploração de dados, justificativas para as escolhas técnicas, implementação de APIs, desenvolvimento de dashboards interativos, planejamento para retreinamento de modelos, armazenamento de logs e manutenção do histórico de desenvolvimento.

---
## Índice

1. [Exploração de Dados para Escolha de Modelos e Dados](#exploração-de-dados-para-escolha-de-modelos-e-dados)
2. [Narrativa de Dados que Justifica a Escolha dos Modelos e Dados](#narrativa-de-dados-que-justifica-a-escolha-dos-modelos-e-dados)
3. [Implementação do Modelo com API de Acesso](#implementação-do-modelo-com-api-de-acesso)
4. [Dashboard que Apresenta os Resultados do Modelo](#dashboard-que-apresenta-os-resultados-do-modelo)
5. [Interação do Dashboard com o Modelo para Diferentes Cenários](#interação-do-dashboard-com-o-modelo-para-diferentes-cenários)
6. [Planejamento para Retreinamento do Modelo com Novos Dados](#planejamento-para-retreinamento-do-modelo-com-novos-dados)
7. [Armazenamento de Logs de Uso do Sistema](#armazenamento-de-logs-de-uso-do-sistema)
8. [Histórico de Desenvolvimento Disponível no Repositório](#histórico-de-desenvolvimento-disponível-no-repositório)

---

## Exploração de Dados para Escolha de Modelos e Dados

### Etapa de Exploração de Dados

Antes de selecionar os modelos e os dados a serem utilizados, foi realizada uma etapa abrangente de exploração de dados, que incluiu:

1. **Coleta de Dados:**
   - Utilizamos a biblioteca `yfinance` para obter dados históricos de preços de diversas criptomoedas.
   - As fontes de dados incluem APIs como Yahoo Finance, CoinGecko e CryptoCompare, garantindo a abrangência e a atualização das informações.

2. **Análise Exploratória:**
   - **Visualização de Séries Temporais:** Plotamos gráficos de preços para identificar padrões, tendências e sazonalidades.
   - **Estatísticas Descritivas:** Calculamos métricas como média, mediana, desvio padrão e correlação para entender a distribuição e a relação entre variáveis.
   - **Detecção de Outliers:** Identificamos e tratamos valores atípicos que poderiam distorcer o treinamento do modelo.

3. **Pré-processamento de Dados:**
   - **Normalização:** Aplicamos `MinMaxScaler` para normalizar os dados de preços, melhorando a performance do modelo LSTM.
   - **Criação de Sequências:** Transformamos os dados históricos em sequências de comprimento fixo (`seq_length`) para alimentar o modelo LSTM.

4. **Seleção de Variáveis:**
   - Focamos nas colunas `Open`, `High`, `Low`, `Close` e `Volume`, considerando que essas métricas fornecem uma visão completa do comportamento do mercado.

### Escolha do Modelo

Após a análise exploratória, decidimos utilizar uma **rede neural LSTM com um bloco de atenção** para a previsão de preços. Essa escolha foi baseada nas seguintes observações:

- **Captura de Dependências Temporais:** O modelo LSTM é eficaz para capturar padrões e tendências em dados sequenciais.
- **Foco em Informações Relevantes:** A camada de atenção permite que o modelo enfatize partes específicas da sequência que são mais informativas para a previsão.
- **Desempenho Superior:** Comparado a modelos tradicionais como ARIMA, o LSTM com atenção demonstrou melhor desempenho em termos de precisão nas previsões.

---

## Narrativa de Dados que Justifica a Escolha dos Modelos e Dados

### Justificativa para a Escolha do Modelo LSTM com Bloco de Atenção

A escolha do modelo LSTM com bloco de atenção foi fundamentada em uma análise detalhada das características dos dados e dos requisitos do projeto:

1. **Natureza dos Dados de Criptomoedas:**
   - **Séries Temporais Voláteis:** Os preços das criptomoedas são altamente voláteis e exibem padrões complexos que variam ao longo do tempo.
   - **Dependências de Longo Prazo:** Eventos passados podem ter impactos significativos nos preços futuros, exigindo um modelo que capture essas dependências.

2. **Capacidade de Capturar Padrões Complexos:**
   - **LSTM:** As camadas LSTM são projetadas para aprender dependências de longo prazo em dados sequenciais, tornando-as ideais para prever tendências em séries temporais.
   - **Atenção:** O mecanismo de atenção permite que o modelo identifique quais partes da sequência de entrada são mais relevantes para a previsão atual, melhorando a precisão e a interpretabilidade das previsões.

3. **Desempenho Empírico:**
   - Testes comparativos entre diferentes modelos, incluindo ARIMA, SVR e redes neurais tradicionais, mostraram que o LSTM com atenção oferecia melhores resultados em termos de métricas como `Mean Squared Error (MSE)` e `Mean Absolute Error (MAE)`.

4. **Flexibilidade e Escalabilidade:**
   - O modelo LSTM com atenção é facilmente escalável e pode ser adaptado para incluir mais variáveis ou ajustar a complexidade da arquitetura conforme necessário.

### Seleção dos Dados

Optamos por utilizar dados históricos de preços que incluíam as seguintes variáveis:

- **Open:** Preço de abertura da criptomoeda no período.
- **High:** Preço máximo atingido no período.
- **Low:** Preço mínimo atingido no período.
- **Close:** Preço de fechamento da criptomoeda no período.
- **Volume:** Volume de negociações no período.

Essas variáveis proporcionam uma visão abrangente do comportamento do mercado, permitindo que o modelo capture tanto as tendências de preço quanto a dinâmica de negociação.

---

## Implementação do Modelo com API de Acesso

### Implementação do Modelo

O modelo de Machine Learning foi implementado utilizando **TensorFlow** e **Keras**, seguindo a arquitetura LSTM com um bloco de atenção. O código completo do modelo está disponível no diretório `notebook/Notebook_Ponderada.ipynb`.

#### Principais Passos da Implementação:

1. **Carregamento e Preparação dos Dados:**
   - Utilizamos `yfinance` para baixar dados históricos.
   - Aplicamos `MinMaxScaler` para normalizar os dados.
   - Criamos sequências de dados para treinar o modelo LSTM.

2. **Construção do Modelo:**
   - Definimos camadas LSTM para capturar dependências temporais.
   - Adicionamos um bloco de atenção para focar em partes relevantes das sequências.
   - Finalizamos com camadas densas para gerar a previsão do próximo preço.

3. **Treinamento e Avaliação:**
   - Treinamos o modelo com `EarlyStopping` para evitar overfitting.
   - Avaliamos o modelo utilizando métricas de erro (`MSE` e `MAE`).

4. **Salvamento do Modelo:**
   - O modelo treinado é salvo em formato `.h5` para posterior uso no backend FastAPI.

### API de Acesso

Desenvolvemos uma **API RESTful** utilizando **FastAPI** para permitir o acesso ao modelo de previsão. A API disponibiliza endpoints para treinar, retreinar e obter previsões de preços.

#### Principais Endpoints:

- **Treinamento do Modelo:**
  - **Endpoint:** `/api/train`
  - **Método:** `POST`
  - **Descrição:** Inicia o treinamento do modelo para uma criptomoeda específica com dados fornecidos.

- **Retreinamento do Modelo:**
  - **Endpoint:** `/api/retrain`
  - **Método:** `POST`
  - **Descrição:** Retreina um modelo existente com novos dados, substituindo o modelo anterior.

- **Obtenção de Previsões:**
  - **Endpoint:** `/api/predict`
  - **Método:** `GET`
  - **Descrição:** Retorna as previsões de preços futuros para uma criptomoeda específica.

#### Disponibilidade da API

A API está implementada no backend FastAPI e pode ser acessada através da URL definida no arquivo `.env`. A documentação interativa da API está disponível em `/docs` após o deployment, permitindo que os usuários explorem e testem os endpoints diretamente pelo navegador.

---

## Dashboard que Apresenta os Resultados do Modelo

### Desenvolvimento do Dashboard

Desenvolvemos um **dashboard interativo** utilizando **Next.js** e **React** para apresentar os resultados das previsões do modelo de forma clara e acessível. O dashboard permite aos usuários visualizar gráficos de preços, métricas de desempenho do modelo e interagir com diferentes cenários de previsão.

#### Funcionalidades Principais:

1. **Visualização de Preços:**
   - Gráficos de linha que mostram os preços históricos e as previsões futuras das criptomoedas selecionadas.
   - Comparação entre os preços reais e previstos para avaliar a precisão do modelo.

2. **Métricas de Desempenho:**
   - Exibição de métricas como `Test Loss` e `Test MAE` para avaliar a performance do modelo.

3. **Seleção de Criptomoedas:**
   - Dropdown ou campo de autocomplete que permite aos usuários selecionar a criptomoeda desejada para visualização.

4. **Interatividade:**
   - Ferramentas de zoom e pan nos gráficos para uma análise detalhada.
   - Opções para selecionar diferentes intervalos de tempo e ver previsões para múltiplos cenários futuros.

### Componentes do Dashboard

Os principais componentes do dashboard incluem:

- **StockChart.tsx:**
  - Responsável por renderizar os gráficos de preços utilizando a biblioteca `recharts`.
  - Integração com a API para buscar e atualizar os dados de previsão em tempo real.

- **StockDetails.tsx:**
  - Exibe informações detalhadas sobre a criptomoeda selecionada, como preço atual, variação diária e volume de negociações.

- **StockSelector.tsx:**
  - Permite aos usuários selecionar a criptomoeda a ser visualizada através de um menu dropdown ou campo de busca com autocomplete.

---

## Interação do Dashboard com o Modelo para Diferentes Cenários

### Funcionalidade de Interação

O dashboard foi projetado para permitir que os usuários interajam com o modelo de previsão, possibilitando a visualização de diferentes cenários com base em parâmetros ajustáveis. Isso é alcançado através das seguintes funcionalidades:

1. **Configuração de Parâmetros:**
   - Os usuários podem definir parâmetros como o intervalo de datas, o número de passos futuros para previsão e a criptomoeda de interesse.
   - Opções para retreinar o modelo diretamente pelo dashboard, caso novos dados estejam disponíveis.

2. **Visualização de Cenários Diferentes:**
   - Capacidade de visualizar previsões com diferentes níveis de confiança ou baseadas em diferentes conjuntos de dados históricos.
   - Comparação de múltiplos modelos ou configurações para avaliar qual oferece melhores resultados.

3. **Atualização em Tempo Real:**
   - O dashboard atualiza automaticamente os gráficos e métricas à medida que novas previsões são geradas ou que o modelo é retreinado.

### Implementação Técnica

Para permitir essa interatividade, os seguintes componentes e tecnologias foram utilizados:

- **API Integration:**
  - O frontend se comunica com a API FastAPI para obter dados de previsão e iniciar processos de treinamento ou retreinamento.

- **State Management:**
  - Utilização de **React Hooks** (`useState`, `useEffect`) para gerenciar o estado dos dados e das interações do usuário.

- **Componentes Interativos:**
  - Botões para iniciar treinamentos e retreinamentos.
  - Formulários para configuração de parâmetros de previsão.

- **Feedback Visual:**
  - Indicadores de carregamento e mensagens de sucesso ou erro para informar os usuários sobre o status das operações realizadas.

---

## Planejamento para Retreinamento do Modelo com Novos Dados

### Estratégia de Retreinamento

Para garantir que o modelo permaneça atualizado e continue a fornecer previsões precisas, implementamos um plano de retreinamento contínuo com novos dados. As principais etapas dessa estratégia incluem:

1. **Automatização do Processo de Retreinamento:**
   - Implementação de endpoints na API FastAPI para facilitar o retreinamento do modelo.
   - Agendamento de retreinamentos periódicos utilizando ferramentas como **cron jobs** ou **celery** para tarefas assíncronas.

2. **Incorporação de Novos Dados:**
   - Utilização de APIs como `yfinance` para obter dados de preços mais recentes das criptomoedas.
   - Processamento e normalização dos novos dados para manter a consistência com o conjunto de dados utilizado no treinamento inicial.

3. **Gerenciamento de Modelos:**
   - Implementação de lógica para salvar apenas um número limitado de modelos (`MAX_MODELS`), garantindo a otimização de recursos.
   - Substituição de modelos antigos pelos mais recentes, mantendo o histórico de treinamento no arquivo `trained_cryptos.json`.

4. **Integração com o Dashboard:**
   - Atualização do dashboard para permitir que os usuários iniciem o retreinamento manualmente, caso desejem incorporar dados recentes imediatamente.
   - Exibição de informações sobre o último retreinamento, incluindo métricas de desempenho pós-retreinamento.

### Implementação Técnica

- **Backend FastAPI:**
  - Endpoints dedicados para retreinamento, que recebem parâmetros como a criptomoeda a ser retreinada e o intervalo de datas.
  - Utilização de `EarlyStopping` para otimizar o processo de treinamento e evitar overfitting.

- **Frontend:**
  - Botões e formulários para iniciar o retreinamento diretamente pelo dashboard.
  - Indicadores de progresso para informar os usuários sobre o status do retreinamento.

- **Persistência de Dados:**
  - Armazenamento dos modelos treinados no diretório `backend/modelo/models`, garantindo que os modelos estejam acessíveis mesmo após reinicializações do container.

---

## Armazenamento de Logs de Uso do Sistema

### Utilização do MongoDB para Logs

Optamos por utilizar o **MongoDB** exclusivamente para o armazenamento de logs de uso do sistema, devido às suas características que se alinham perfeitamente com as necessidades do projeto:

1. **Flexibilidade de Schema:**
   - Logs podem variar em estrutura e conteúdo. O MongoDB permite armazenar documentos com diferentes campos sem a necessidade de um esquema rígido.

2. **Performance em Escrita:**
   - O MongoDB é otimizado para operações de escrita rápidas, o que é essencial para capturar logs em tempo real sem impactar a performance dos serviços principais.

3. **Facilidade de Consulta:**
   - Com poderosas capacidades de indexação e consultas, o MongoDB facilita a análise e a busca nos logs, permitindo identificar padrões, erros e eventos específicos de maneira eficiente.

4. **Escalabilidade:**
   - Mesmo com o aumento do volume de logs, o MongoDB pode escalar horizontalmente para acomodar o crescimento sem perda significativa de performance.

### Justificativa para Não Utilizar o MongoDB como Data Lake

Apesar das capacidades robustas do MongoDB, decidimos não utilizá-lo como **data lake** por diversas razões:

1. **Escalabilidade e Custo:**
   - Data lakes geralmente armazenam enormes volumes de dados brutos. Soluções como Amazon S3 oferecem custos mais baixos para armazenamento em massa comparados ao MongoDB.

2. **Ferramentas de Processamento Especializadas:**
   - Data lakes são frequentemente integrados com ferramentas de processamento de dados em larga escala, como Apache Spark. Essas integrações são mais eficientes com soluções específicas para data lakes do que com o MongoDB.

3. **Gestão de Metadados:**
   - A gestão de metadados é crucial em data lakes para a descoberta e governança de dados. Ferramentas especializadas oferecem funcionalidades mais robustas para essa finalidade.

4. **Tipos de Dados:**
   - Data lakes suportam uma variedade mais ampla de tipos de dados, incluindo dados não estruturados, semi-estruturados e estruturados, o que é mais limitado no MongoDB.

### Implementação Técnica dos Logs

- **Backend Golang:**
  - Integração com o MongoDB para inserir logs de uso sempre que operações significativas são realizadas, como treinamentos de modelos, retreinamentos e previsões.
  - Estrutura flexível de documentos para capturar informações detalhadas sobre cada evento.

- **MongoDB:**
  - Banco de dados configurado para armazenar logs no arquivo `trained_cryptos.json`.
  - Indexação de campos relevantes para otimizar consultas e análises futuras.

- **Frontend:**
  - Nenhuma interação direta com o MongoDB, mantendo a separação de responsabilidades e garantindo que o frontend permaneça leve e responsivo.

---

## Histórico de Desenvolvimento Disponível no Repositório

### Manutenção do Histórico de Desenvolvimento

Para garantir transparência e facilitar a colaboração, mantemos um **histórico de desenvolvimento detalhado** no repositório do projeto. As principais práticas adotadas incluem:

1. **Controle de Versão com Git:**
   - Utilizamos o **Git** para gerenciar todas as alterações no código-fonte, permitindo rastrear modificações, reverter mudanças e colaborar de maneira eficiente.

2. **Commits Significativos:**
   - Realizamos commits frequentes com mensagens claras e descritivas, facilitando a compreensão do progresso e das alterações feitas ao longo do tempo.

3. **Branches para Funcionalidades:**
   - Adotamos uma estratégia de branching que inclui **branches de feature**, **branches de bugfix** e **branches de release**, garantindo uma organização clara e evitando conflitos no código.

4. **Pull Requests e Revisões de Código:**
   - Todas as alterações significativas são submetidas através de **pull requests**, que são revisados por outros membros da equipe para garantir a qualidade e a integridade do código.

5. **Documentação Atualizada:**
   - Mantemos a documentação do projeto sempre atualizada no repositório, incluindo guias de instalação, manuais de uso e notas de versão.

6. **Issues e Projetos:**
   - Utilizamos o sistema de **issues** do GitHub para gerenciar tarefas, bugs e solicitações de melhorias.
   - Ferramentas de **projetos** são utilizadas para planejar e acompanhar o progresso das funcionalidades e correções.

### Disponibilidade do Histórico

O histórico completo de desenvolvimento está disponível no repositório do projeto no GitHub, acessível através do link:

- **Repositório GitHub:** [https://github.com/seu-usuario/seu-repositorio](https://github.com/seu-usuario/seu-repositorio)

### Benefícios do Histórico de Desenvolvimento

- **Transparência:** Permite que novos colaboradores entendam rapidamente o histórico e o progresso do projeto.
- **Responsabilidade:** Facilita a identificação de responsáveis por determinadas funcionalidades ou correções.
- **Reprodutibilidade:** As versões anteriores do código podem ser facilmente acessadas e reimplementadas se necessário.
- **Colaboração:** Promove um ambiente colaborativo onde múltiplos desenvolvedores podem contribuir de maneira organizada.

---

## Conclusão

O projeto de previsão de preços de criptomoedas foi desenvolvido seguindo rigorosos critérios de qualidade e melhores práticas de engenharia de software. Desde a exploração de dados e a escolha de modelos até a implementação de APIs e dashboards interativos, cada etapa foi cuidadosamente planejada e executada para garantir a eficácia e a usabilidade da aplicação.

### Destaques do Projeto:

- **Exploração de Dados Abrangente:** Garantiu a escolha de modelos e dados adequados para previsões precisas.
- **Modelo Robusto:** Implementação de um modelo LSTM com bloco de atenção que se destaca em tarefas de previsão de séries temporais.
- **API Acessível:** Facilitou o acesso e a interação com o modelo através de endpoints RESTful bem definidos.
- **Dashboard Interativo:** Proporcionou uma interface amigável para visualização e interação com as previsões do modelo.
- **Planejamento para Retreinamento:** Assegurou que o modelo permaneça atualizado com novos dados, mantendo sua relevância e precisão.
- **Armazenamento Eficiente de Logs:** Utilização do MongoDB para gerenciar logs de uso do sistema de forma eficiente e escalável.
- **Histórico de Desenvolvimento Transparente:** Facilita a colaboração e a manutenção do projeto, garantindo um desenvolvimento contínuo e organizado.

### Próximos Passos:

- **Melhorias na Interface do Dashboard:**
  - Implementar gráficos mais avançados e interativos.
  - Adicionar funcionalidades de exportação de dados e relatórios.

- **Otimização do Modelo de Machine Learning:**
  - Explorar arquiteturas mais complexas e técnicas de regularização para melhorar ainda mais a precisão.
  - Implementar validação cruzada para garantir a generalização do modelo.

- **Automatização de Processos:**
  - Integrar pipelines de CI/CD para automatizar testes, builds e deployments.
  - Implementar monitoramento contínuo dos serviços e desempenho do modelo.

- **Segurança e Autenticação:**
  - Adicionar mecanismos de autenticação e autorização para proteger os endpoints da API.
  - Implementar práticas de segurança para proteger os dados armazenados no MongoDB e nos modelos.

Agradecemos pelo interesse e pela colaboração no desenvolvimento deste projeto. Para quaisquer dúvidas, sugestões ou contribuições, sinta-se à vontade para entrar em contato ou abrir uma issue no repositório.

---
