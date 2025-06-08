# GS1 - EcoAlert

Um aplicativo mobile desenvolvido em React Native (Expo) + TypeScript, projetado para auxiliar na prevenção e monitoramento de desastres naturais, proporcionando uma experiência moderna e eficiente para os usuários.

## 🚀 Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- Styled Components
- React Navigation
- React Native Maps
- Async Storage
- React Native Elements

## 📱 Funcionalidades

- Monitoramento em tempo real de condições climáticas
- Alertas de desastres naturais
- Mapeamento de áreas de risco
- Sistema de notificações push
- Armazenamento offline de dados importantes
- Interface responsiva e adaptável
- Desenvolvimento com TypeScript para maior segurança

## 🛠️ Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis da UI
├── contexts/       # Provedores de Contexto React
├── data/          # Dados estáticos e constantes
├── routes/        # Configuração de navegação
├── screens/       # Componentes de tela
├── services/      # Integrações com APIs e serviços externos
├── styles/        # Estilos globais e temas
└── types/         # Definições de tipos TypeScript
```

## 🚀 Como Começar

### Pré-requisitos

- Node.js (versão LTS)
- npm ou yarn
- Expo CLI
- iOS Simulator (para Mac) ou Android Studio (para desenvolvimento Android)

### Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
yarn start
```

4. Execute em uma plataforma específica:
```bash
# Para iOS
npm run ios
# Para Android
npm run android
# Para Web
npm run web
```

## 🔧 Configuração

Antes de executar o aplicativo, certifique-se de:

1. Configurar sua chave de API do Google Maps em `app.json`:
   - Substitua `YOUR_GOOGLE_MAPS_API_KEY` pela sua chave de API real para as configurações iOS e Android

2. Configurar variáveis de ambiente se necessário

## 📦 Dependências Principais

- @react-navigation/native: ^7.0.19
- @react-navigation/native-stack: ^7.3.3
- react-native-maps: 1.20.1
- styled-components: ^6.1.16
- @react-native-async-storage/async-storage: 2.1.2



## 👥 Autores

- Felipe Seiki Hashiguti - RM: 98985
- Lucas Corradini Silveira - RM: 555118
- Matheus Gregorio Mota - RM: 557254
