
### ☕ Café Fidelidade – App de QRCode Premiado

Sistema completo para cafeteria com programa de fidelidade: cada cliente acumula 5 escaneamentos de QRCode e ganha um café grátis. O app é composto por backend (Node.js + Express + JWT + persistência em JSON) e frontend (React Native + Expo + TypeScript).

---

### 📱 Funcionalidades

· Cadastro de usuário – novo cliente já ganha 1 copo de cortesia.
· Login com JWT – autenticação segura.
· Home – exibe 5 ícones de café; os preenchidos indicam quantos copos o cliente já acumulou.
· Escaneamento de QRCode – botão flutuante abre a câmera; ao escanear um código válido (PROMOCAO_CAFE), o contador de copos aumenta.
· Prêmio automático – ao completar 5 copos, o sistema gera um QRCode único de café grátis para retirada na loja.
· Tela de premiação – mostra o QRCode do prêmio e o código textual para validação manual.
· Validação do prêmio – a loja pode marcar o prêmio como usado via rota protegida.

---

### 🛠️ Tecnologias

## Backend

· Node.js + Express
· JWT (jsonwebtoken)
· Bcrypt (hash de senhas)
· Persistência em arquivo JSON (users.json)
· UUID para códigos de prêmio

##Frontend (Mobile)

· React Native + TypeScript
· Expo (gerenciamento e build)
· React Navigation (Stack)
· Expo Barcode Scanner
· Axios (requisições HTTP)
· @expo/vector-icons (ícones de café)
· react-native-qrcode-svg (geração de QRCode)

---

### 📦 Estrutura do Projeto

```
/
├── backend/
│   ├── server.js          # API principal
│   ├── users.json         # banco de dados (criado automaticamente)
│   └── package.json
└── frontend/
    ├── App.tsx
    ├── src/
    │   ├── contexts/      # UserContext (estado global)
    │   ├── services/      # api.ts (axios config)
    │   └── screens/       # Login, Register, Home, Scanner, Premio
    └── package.json
```

---

### 🔧 Backend – Detalhes e Mensagens

## Rotas disponíveis

Método Rota Descrição
POST /auth/register Cadastro de novo usuário. Retorna token e dados do usuário (já com copos: 1).
POST /auth/login Login. Retorna token e dados do usuário.
GET /user Retorna dados completos do usuário logado (requer token).
POST /scan Escaneia QRCode (corpo { codigo: "PROMOCAO_CAFE" }). Incrementa copos; se chegar a 5, gera prêmio e zera contador.
POST /validate-premio Marca um prêmio como usado (corpo { codigo: "uuid" }).

## Mensagens de retorno (exemplos)

· Cadastro bem-sucedido:
    { token, user: { id, name, email, copos } } com status 201.
· Erro de cadastro (email já existe):
    { error: "Email já cadastrado" } status 400.
· Login bem-sucedido:
    { token, user: { ... } } status 200.
· Credenciais inválidas:
    { error: "Credenciais inválidas" } status 401.
· Scan com código válido (sem prêmio):
    { copos: X } (X é o novo número de copos).
· Scan com prêmio ganho:
    { copos: 0, premio: "uuid" } – o prêmio é automaticamente adicionado ao array premios do usuário.
· Scan com código inválido:
    { error: "Código inválido" } status 400.
· Validação de prêmio bem-sucedida:
    { success: true }.
· Prêmio não encontrado ou já usado:
    { error: "Prêmio não encontrado ou já utilizado" } status 404.

---

### 🚀 Como executar

1. Backend

```bash
cd backend
npm install
npm run dev   # inicia com nodemon (ou node server.js)
```

O servidor rodará em http://localhost:3000.
O arquivo users.json será criado automaticamente na primeira execução.

2. Frontend (Expo)

```bash
cd frontend
npm install
npx expo start
```

No arquivo src/services/api.ts, altere baseURL para o IP da máquina onde o backend está rodando (ex: http://192.168.1.100:3000).

---

### 📝 Scripts disponíveis

No package.json do backend:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

No frontend (gerado pelo Expo), os scripts padrão:

```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web"
}
```

---

### 🔒 Segurança

· Senhas armazenadas com bcrypt (hash + salt).
· Tokens JWT com validade de 7 dias.
· Rotas protegidas por middleware que verifica o token no header Authorization: Bearer <token>.
· Prêmios possuem código único UUID e são marcados como usados para evitar reutilização.

---

### 📷 Fluxo do Usuário

1. Abre o app → tela de login.
2. Cadastra-se → ganha 1 copo imediatamente.
3. Na Home, vê os 5 copos (um já preenchido).
4. Toca no botão flutuante com ícone de QRCode → abre a câmera.
5. Escaneia o QRCode fixo (PROMOCAO_CAFE) disponível na loja.
6. Cada escaneamento soma +1 copo.
7. Ao completar 5 copos, o app exibe um alerta e navega para a tela de premiação.
8. Na tela de premiação, aparece um QRCode único que o cliente mostra ao atendente.
9. Atendente valida o código via rota /validate-premio (pode ser integrado a um sistema interno) e entrega o café.

---

### 🧪 Testes

Para testar o backend sem o app, use ferramentas como Postman ou Insomnia:

· POST /auth/register com { name, email, password }
· POST /auth/login com { email, password }
· GET /user com token no header
· POST /scan com { codigo: "PROMOCAO_CAFE" } e token
· POST /validate-premio com { codigo: "uuid_do_premio" } e token

---

### 👨‍💻 Autor

Desenvolvido como exemplo de aplicação fullstack com Node.js e React Native para programas de fidelidade.

---

### ☕ Bom café e bons códigos!

---
