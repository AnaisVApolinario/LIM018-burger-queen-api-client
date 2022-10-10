const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

const secret = "EsUnSecreto"

server.use(jsonServer.bodyParser)
server.use(middlewares)

server.use((req, res, next) => {

  console.log(req.headers);


  if(req.method === "GET" && req.path === "/algo") {
    console.log("hola")
   res('Bienvenido');
  } else if(req.headers.authorization === `Bearer ${secret}`) {
    console.log(req.headers.authorization)
  next()
  } else {
    console.log("adios")
  res.sendStatus(401)
  }
 })


server.post('/auth', (req, res) => {

  if (
    req.body.email === 'pame@gmail.com' &&
    req.body.password === '123456') {
    res.jsonp({
      token: secret
    })
  } else res.status(400).send('Bad Request')
})

server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})