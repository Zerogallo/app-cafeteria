const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'secreto';
const DATA_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(bodyParser.json());

// --- Persistência ---
function readUsers() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// --- Middleware de autenticação ---
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// --- Rotas ---

// Registro
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Campos obrigatórios' });

  const users = readUsers();
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email já cadastrado' });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashed,
    copos: 1,                // ganha 1 copo ao se cadastrar
    premios: []
  };
  users.push(newUser);
  writeUsers(users);

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, copos: newUser.copos }
  });
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Campos obrigatórios' });

  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, copos: user.copos }
  });
});

// Dados do usuário
app.get('/user', authenticate, (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json({ id: user.id, name: user.name, email: user.email, copos: user.copos, premios: user.premios });
});

// Escanear QRCode (código fixo: "PROMOCAO_CAFE")
app.post('/scan', authenticate, (req, res) => {
  const { codigo } = req.body;
  if (codigo !== 'PROMOCAO_CAFE') return res.status(400).json({ error: 'Código inválido' });

  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === req.userId);
  if (userIndex === -1) return res.status(404).json({ error: 'Usuário não encontrado' });

  const user = users[userIndex];
  let copos = user.copos + 1;
  let premio = null;

  if (copos >= 5) {
    const codigoPremio = uuidv4();
    user.premios.push({ codigo: codigoPremio, usado: false });
    premio = codigoPremio;
    copos = 0; // reseta após ganhar prêmio
  }

  user.copos = copos;
  users[userIndex] = user;
  writeUsers(users);

  res.json({ copos, premio });
});

// Validar prêmio (para a loja)
app.post('/validate-premio', authenticate, (req, res) => {
  const { codigo } = req.body;
  if (!codigo) return res.status(400).json({ error: 'Código do prêmio obrigatório' });

  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === req.userId);
  if (userIndex === -1) return res.status(404).json({ error: 'Usuário não encontrado' });

  const user = users[userIndex];
  const premio = user.premios.find(p => p.codigo === codigo && !p.usado);
  if (!premio) return res.status(404).json({ error: 'Prêmio não encontrado ou já utilizado' });

  premio.usado = true;
  users[userIndex] = user;
  writeUsers(users);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`
====================================
✅ Backend rodando!
📍 URL: http://localhost:${PORT}
====================================
`);
});
