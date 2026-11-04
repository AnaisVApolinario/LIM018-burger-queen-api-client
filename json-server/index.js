const crypto = require('crypto');
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const PORT = 3000;

// token -> id de usuario. Se pierde al reiniciar: el cliente recibe 401 y vuelve al login.
const sessions = new Map();

const withoutPassword = (value) => {
  if (Array.isArray(value)) return value.map(withoutPassword);
  if (value && typeof value === 'object' && 'password' in value) {
    const { password, ...rest } = value;
    return rest;
  }
  return value;
};

// Quién puede hacer qué.
const canAccess = (user, method, resource) => {
  const isRead = method === 'GET';
  switch (resource) {
    case 'users':
      return user.rol === 'admin';
    case 'products':
      return isRead || user.rol === 'admin';
    case 'orders':
      if (isRead) return true;
      if (method === 'POST') return user.rol === 'waiter';
      if (method === 'PATCH' || method === 'PUT') return user.rol === 'waiter' || user.rol === 'chef';
      return false;
    default:
      return false;
  }
};

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.post('/auth', (req, res) => {
  const { email, password } = req.body || {};
  const user = router.db
    .get('users')
    .find((u) => u.email === email && u.password === password)
    .value();

  if (!user) {
    return res.status(400).json({ message: 'Credenciales inválidas' });
  }

  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, user.id);
  res.json({ token, user: withoutPassword(user) });
});

server.use((req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  const userId = sessions.get(token);
  const user = userId === undefined ? undefined : router.db.get('users').find({ id: userId }).value();

  if (!user) return res.sendStatus(401);
  if (!canAccess(user, req.method, req.path.split('/')[1])) return res.sendStatus(403);

  next();
});

router.render = (req, res) => {
  res.jsonp(withoutPassword(res.locals.data));
};

server.use(router);

server.listen(PORT, () => {
  console.log(`API de Burger Queen lista en http://localhost:${PORT}`);
});