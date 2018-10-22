var server = require('./server')
var bodyParser = require('./middlewares/bodyParser')
var staticFileHandler = require('./middlewares/staticFileHandler')

server.create(9000)

server.addHandler(staticFileHandler.staticFileHandler('./src'))

server.addHandler(bodyParser.typePlainText)
server.addHandler(bodyParser.typeJSON)
server.addHandler(bodyParser.typeURLEncoded)

server.addHandler((req, res, next) => {
  next(req, res)
})

server.addRoute('/data', 'POST', (req, res) => {
  res.body = req.body
  res.setHeaders()
  res.send()
})

server.addRoute('/', 'GET', (req, res) => {
  res.body = req.body
  res.setHeaders()
  res.send()
})
