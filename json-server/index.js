const crypto = require("crypto");
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3000;
const SECRET = process.env.TOKEN_SECRET || "amero-burger-secreto-de-desarrollo";

const sign = (userId) =>
  crypto.createHmac("sha256", SECRET).update(String(userId)).digest("hex");

const createToken = (userId) => `${userId}.${sign(userId)}`;

const findUserById = (id) =>
  router.db
    .get("users")
    .find((user) => String(user.id) === String(id))
    .value();
/** Devuelve el usuario dueño del token, o undefined si el token es falso o el usuario ya no existe. */
const userFromToken = (token) => {
  const [userId, signature] = token.split(".");
  if (!userId || !signature) return undefined;

  const received = Buffer.from(signature);
  const expected = Buffer.from(sign(userId));
  if (
    received.length !== expected.length ||
    !crypto.timingSafeEqual(received, expected)
  ) {
    return undefined;
  }
  return findUserById(userId);
};

const withoutPassword = (value) => {
  if (Array.isArray(value)) return value.map(withoutPassword);
  if (value && typeof value === "object" && "password" in value) {
    const { password, ...rest } = value;
    return rest;
  }
  return value;
};

// Quién puede hacer qué.
const canAccess = (user, method, resource) => {
  const isRead = method === "GET";
  switch (resource) {
    case "users":
      return user.rol === "admin";
    case "products":
      return isRead || user.rol === "admin";
    case "orders":
      if (isRead) return true;
      if (method === "POST") return user.rol === "waiter";
      if (method === "PATCH" || method === "PUT")
        return user.rol === "waiter" || user.rol === "chef";
      return false;
    default:
      return false;
  }
};

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.post("/auth", (req, res) => {
  const { email, password } = req.body || {};
  const user = router.db
    .get("users")
    .find((u) => u.email === email && u.password === password)
    .value();

  if (!user) {
    return res.status(400).json({ message: "Credenciales inválidas" });
  }

   res.json({ token: createToken(user.id), user: withoutPassword(user) });
});

server.use((req, res, next) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  const user = userFromToken(token);

  if (!user) return res.sendStatus(401);
  if (!canAccess(user, req.method, req.path.split("/")[1]))
    return res.sendStatus(403);

  next();
});

router.render = (req, res) => {
  res.jsonp(withoutPassword(res.locals.data));
};

server.use(router);

server.listen(PORT, () => {
  console.log(`API de Burger Queen lista en http://localhost:${PORT}`);
});
