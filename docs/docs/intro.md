# 📊 Finanças Next JS - Documentação

## Introdução

Bem-vindo à documentação do **Crypto Price Prediction App**, uma aplicação fullstack projetada para prever preços de criptomoedas, combinando técnicas avançadas de **inteligência artificial** e **aprendizado de máquina** com uma arquitetura escalável e eficiente.

### Objetivo

O principal objetivo desta aplicação é fornecer previsões precisas de preços de criptomoedas, auxiliando investidores e analistas a tomar decisões informadas sobre o mercado de ativos digitais. O sistema prevê o comportamento futuro das criptomoedas com base em dados históricos e tendências de mercado, utilizando modelos de machine learning treinados.

### Arquitetura

A arquitetura do projeto foi cuidadosamente projetada para garantir alta performance, modularidade e fácil manutenção. Ela utiliza uma combinação de tecnologias modernas, cada uma responsável por uma parte essencial do sistema:

- **Frontend**: Desenvolvido com **Next.js**, uma das bibliotecas mais populares de React, o frontend proporciona uma interface de usuário **intuitiva** e **dinâmica**, garantindo uma experiência fluida para o usuário final. O Next.js também facilita a renderização no lado do servidor, melhorando a performance e o SEO da aplicação.
  
- **Backend**: O backend principal foi construído em **Golang**, que é reconhecido por sua **alta performance** e **eficiência** no tratamento de grandes volumes de dados e solicitações simultâneas. O backend é responsável por gerenciar a lógica de negócios, validações e o fluxo de dados entre o frontend e os serviços de machine learning.

- **Serviço de Previsão (Machine Learning)**: O serviço de previsão é implementado utilizando **FastAPI**, um framework moderno de alta performance para APIs em Python. Este serviço é dedicado a lidar com as requisições de previsão, recebendo os dados históricos das criptomoedas e retornando previsões com base em modelos de aprendizado de máquina treinados.

- **Banco de Dados**: Utilizamos **MongoDB** como banco de dados principal para armazenar os dados históricos de preços e as previsões geradas pelo modelo. O MongoDB foi escolhido por sua **flexibilidade** em trabalhar com grandes volumes de dados não estruturados e sua capacidade de **escalar horizontalmente** conforme a demanda da aplicação cresce.

### Fluxo de Funcionamento

1. O usuário acessa a interface frontend desenvolvida em Next.js e escolhe a criptomoeda para a qual deseja obter previsões.
2. O frontend envia uma solicitação ao backend em Golang, que valida os dados de entrada e os envia para o serviço de machine learning.
3. O serviço de previsão, utilizando FastAPI, processa os dados históricos armazenados no MongoDB e aplica o modelo de machine learning para gerar a previsão de preço.
4. As previsões são retornadas ao backend em Golang, que as repassa ao frontend para exibição ao usuário.
5. As previsões são armazenadas no MongoDB para consultas futuras e análises.

### Benefícios

- **Previsões em Tempo Real**: O sistema é capaz de fornecer previsões em tempo real de múltiplas criptomoedas simultaneamente.
- **Escalabilidade**: A arquitetura modular permite fácil escalabilidade horizontal, suportando um aumento no volume de dados e usuários sem comprometer a performance.
- **Alto Desempenho**: Utilizando Golang e FastAPI, conseguimos otimizar o tempo de resposta para previsões complexas, garantindo uma experiência de usuário rápida e eficiente.

Este sistema foi desenvolvido com o objetivo de ser uma ferramenta poderosa e acessível para qualquer pessoa interessada no mercado de criptomoedas, desde investidores iniciantes até traders profissionais.
