<h1 align="center">
  <br>
  <img src="https://github.com/JoaoGiannattasio/MapsBarber/blob/main/funcioa.png" alt="Barbershop Logo" width="200">
  <br>
  Barbershop API
  <br>
</h1>

<h4 align="center">API para gestão de agendamentos, clientes, serviços e feedbacks em uma barbearia.</h4>
---
## Objetivos
O que essa aplicação faz e quem usa essa solução?
Essa aplicação, juntamente com o backend, oferece uma interface móvel interativa para gerenciar os serviços da barbearia. O administrador pode realizar o cadastro de serviços, clientes, barbeiros e agendamentos, além de acompanhar o fluxo de atividades. Os clientes podem acessar o aplicativo para visualizar os serviços disponíveis, agendar horários e acompanhar seus atendimentos.

Personas
Telas do usuário ADMINISTRADOR: realiza o cadastro de clientes, serviços e horários disponíveis, além de gerenciar agendamentos. Alimenta o aplicativo com informações sobre os serviços oferecidos e organiza o fluxo da barbearia.
Tela do usuário CLIENTE: consulta os serviços disponíveis, faz agendamentos e verifica detalhes sobre seus horários e atendimentos.

Modelo de Negócio
Sem fins lucrativos

Modelo de Domínio
Aplicativo de gestão e interação entre a barbearia e os clientes.
---
## Documentação BarberShop: https://manuellrds.github.io/docprjetoBARBER/
- ** UML está dentro da documentação/Ao final deste README, está disponível o UML**

##MANUAL DO USUÁRIO: https://manuellrds.github.io/manueldeusuario/Manual_de_usuario.pdf
- ** Para econtrar o manual de usuário no app, fica esse caminho app\src\pages\login\index.tsx, linha 36**

## Recursos

- **Agendamentos:** Gerencie os horários e serviços agendados para os clientes.
- **Clientes:** Controle as informações dos clientes cadastrados.
- **Serviços:** Cadastre e gerencie serviços disponíveis na barbearia (corte, barba, etc.).
- **Feedbacks:** Receba e gerencie os feedbacks dos clientes.
- **Login:** Gerencie autenticação de usuários (administradores e clientes).

---

## Tecnologias Utilizadas

- **Express**
- **Swagger** para documentação da API
- **Servidor Flask** Servidor python
- **Frontend: React Native com Expo.
- **Backend: Node.js com Express.
- **Banco de Dados: MySQL.
- **Outras Dependências:
- **Axios (para consumo de APIs).
- **React Navigation (para navegação no app).

---

## Instalação

Antes de começar, certifique-se de ter os seguintes itens instalados em sua máquina:

Node.js:
Necessário para rodar o npm e gerenciar dependências do projeto. Você pode baixar e instalar a versão mais recente diretamente do site oficial do Node.js.

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/barbershop.git
2. Navegue até o diretório do projeto:
   ```bash
   cd app
3. Instale as dependências:
   ```bash
   npm install
4. Dependencias instaladas ao dar o comando npm install
   ```bash
   npm install @babel/core@7.26.0
   npm install @expo/metro-runtime@4.0.0
   npm install @react-native-community/cli@15.1.2
   npm install @react-native-community/datetimepicker@8.2.0
   npm install @react-native-community/masked-view@0.1.11
   npm install @react-native-picker/picker@2.9.0
   npm install @react-navigation/native-stack@6.11.0
   npm install @react-navigation/native@6.1.18
   npm install @react-navigation/stack@6.4.1
   npm install @types/axios@0.14.4
   npm install @types/react-native@0.73.0
   npm install @types/react-navigation@3.4.0
   npm install @types/react@18.3.12
   npm install axios@1.7.7
   npm install bcrypt@5.1.1
   npm install bcryptjs@2.4.3
   npm install body-parser@1.20.3
   npm install cors@2.8.5
   npm install date-fns@4.1.0
   npm install expo-modules-core@2.0.3
   npm install expo-status-bar@2.0.0
   npm install expo@52.0.7
   npm install express@4.21.1
   npm install fast-csv@5.0.2
   npm install jsonwebtoken@9.0.2
   npm install mysql@2.18.1
   npm install mysql2@3.11.5
   npm install react-dom@18.3.1
   npm install react-native-calendars@1.1307.0
   npm install react-native-fast-image@8.6.3
   npm install react-native-gesture-handler@2.20.2
   npm install react-native-picker-select@9.3.1
   npm install react-native-reanimated@3.16.1
   npm install react-native-safe-area-context@4.12.0
   npm install react-native-screens@4.0.0
   npm install react-native-web@0.19.13
   npm install react-native@0.76.3
   npm install react@18.3.1 

5. Instale o Swagger(documentação API)
   ```bash
   npm install swagger-jsdoc@6.2.8
   npm install swagger-ui-express@5.0.1
6. Instale Expo CLI(Ferramenta para criar, executar e gerenciar projetos em React Native usando o Expo.)
   ```bash
   npm install -g expo-cli

7. Instale o servidor python
    ```bash
       pip install Flask
8. Inicie o servidor flask
   ```bash
   py server.py

7. Inicie o servidor:
   ```bash
   node server.js
   
8. Inicie o expo go
   ```bash
   npx expo start

9. Acesse a documentação no navegador:
   ```bash
   http://localhost:3000/api-docs/#

## Dependências Python Instaladas

Este projeto utiliza as seguintes bibliotecas e ferramentas Python. Certifique-se de que elas estão instaladas no seu ambiente antes de rodar o código:

| Pacote                   | Versão    | Descrição                                                                 |
|--------------------------|-----------|---------------------------------------------------------------------------|
| `blinker`                | 1.9.0     | Biblioteca de sinalização para Flask e outras aplicações.                |
| `click`                  | 8.1.7     | Biblioteca para criação de interfaces de linha de comando.                |
| `colorama`               | 0.4.6     | Ferramenta para suporte a cores no terminal.                              |
| `contourpy`              | 1.3.1     | Suporte a contornos em visualizações (usado pelo Matplotlib).             |
| `cycler`                 | 0.12.1    | Gerenciador de ciclos para criação de gráficos.                           |
| `Flask`                  | 3.1.0     | Microframework para desenvolvimento de aplicações web.                    |
| `Flask-Cors`             | 5.0.0     | Suporte a CORS para aplicações Flask.                                     |
| `fonttools`              | 4.55.0    | Ferramentas para manipulação de fontes.                                   |
| `itsdangerous`           | 2.2.0     | Ferramenta para assinaturas criptográficas.                               |
| `Jinja2`                 | 3.1.4     | Motor de templates para Flask.                                            |
| `kiwisolver`             | 1.4.7     | Solucionador de sistemas de restrições (usado pelo Matplotlib).           |
| `MarkupSafe`             | 3.0.2     | Biblioteca para manipulação segura de strings HTML/XML.                   |
| `matplotlib`             | 3.9.3     | Biblioteca para criação de gráficos e visualizações.                      |
| `mysql-connector-python` | 9.1.0     | Conector para MySQL em Python.                                            |
| `numpy`                  | 2.1.3     | Biblioteca para computação numérica e manipulação de arrays.              |
| `packaging`              | 24.2      | Ferramenta para análise de dependências e empacotamento.                  |
| `pandas`                 | 2.2.3     | Biblioteca para manipulação e análise de dados.                           |
| `pillow`                 | 11.0.0    | Biblioteca para manipulação de imagens.                                   |
| `pip`                    | 24.3.1    | Gerenciador de pacotes do Python.                                         |
| `pyparsing`              | 3.2.0     | Ferramenta para parsing de strings.                                       |
| `python-dateutil`        | 2.9.0.post0 | Extensão para manipulação de datas no Python.                            |
| `python-dotenv`          | 1.0.1     | Suporte a variáveis de ambiente a partir de arquivos `.env`.              |
| `pytz`                   | 2024.2    | Suporte a fusos horários para Python.                                     |
| `seaborn`                | 0.13.2    | Biblioteca para criação de gráficos estatísticos.                         |
| `six`                    | 1.16.0    | Biblioteca para compatibilidade entre Python 2 e 3.                       |
| `tzdata`                 | 2024.2    | Dados de fusos horários atualizados.                                      |
| `Werkzeug`               | 3.1.3     | Ferramenta WSGI para aplicações web (usado pelo Flask).                   |

### Como Instalar as Dependências

11. Para instalar todas as bibliotecas listadas, você pode usar o seguinte comando:
    ```bash
    pip install -r requirements.txt


## Endpoints Disponíveis

### Cortes
- **POST** `/cortes` - Adiciona um novo corte.  
- **GET** `/cortes` - Lista todos os cortes.  
- **PUT** `/cortes/{id}` - Atualiza os dados de um corte.  
- **DELETE** `/cortes/{id}` - Exclui um corte.

### Horários
- **POST** `/horarios` - Adiciona um novo horário.  
- **GET** `/horarios` - Lista todos os horários.  
- **PUT** `/horarios/{id}` - Atualiza os dados de um horário.  
- **DELETE** `/horarios/{id}` - Exclui um horário.  

### Barbeiros
- **POST** `/barbeiros` - Adiciona um novo barbeiro.  
- **GET** `/barbeiros` - Lista todos os barbeiros.  
- **PUT** `/barbeiros/{id}` - Atualiza os dados de um barbeiro.  
- **DELETE** `/barbeiros/{id}` - Remove um barbeiro.   

### Autenticação
- **POST** `/login` - Realiza o login de um usuário.
### Agendamentos
- **DELETE** `/agendamentos/{id}` - Exclui um agendamento.  
- **PUT** `/agendamentos/{id}` - Atualiza um agendamento.  
- **POST** `/agendamentos` - Cria um novo agendamento.  
- **GET** `/agendamentos` - Lista todos os agendamentos.  
- **DELETE** `/agendamentos/porHorario/{horarioId}` - Exclui agendamentos por horário.  

### Feedback
- **POST** `/feedback` - Cria um feedback.  
- **GET** `/feedback` - Lista todos os feedbacks.  
- **PUT** `/feedback/{id}` - Atualiza um feedback.  
- **DELETE** `/feedback/{id}` - Exclui um feedback.  

### Usuário
- **GET** `/usuario` - Obtém os dados do usuário.  
- **POST** `/usuario` - Cria um novo usuário.  
- **PUT** `/usuario/{id}` - Atualiza um usuário.  
- **DELETE** `/usuario/{id}` - Exclui um usuário.

### Preços
- **GET** `/precos` - Busca preços.  
- **POST** `/precos` - Adiciona um preço.  
- **PUT** `/precos/{id}` - Atualiza um preço.  
- **DELETE** `/precos/{id}` - Exclui um preço.
----------
UML
 <br>
  <img src="https://github.com/manuellrds/PROJETO_UP_BARBERSHOP_APP/blob/main/UML.png" alt="UML" width="600">
  <br>




