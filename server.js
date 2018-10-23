var net = require('net')
var Response = require('./modules/response')

function create (port) {
  var server = net.createServer()
  server.on('connection', (socket) => {
    var remoteAddress = socket.remoteAddress + ':' + socket.remotePort
    console.log('Gentlemen! We have a new client at ' + remoteAddress)
    dataHandler(socket)
  })
  server.on('error', (err) => {
    console.log('Oh damn. An error ' + err)
  })
  server.listen(port, () => {
    var serverAddress = server.address()
    console.log('The server that is I, listens on ' + serverAddress.port)
  })
}

var handlers = []

function dataHandler (socket) {
  let requestBuffer = Buffer.from([])
  let reqObj = {}
  socket.on('data', (data) => {
    // console.log('Data from client is ' + data)
    // console.log('The request object is ' + JSON.stringify(requestParser(data), null, '\t'))
    // socket.write('Hello client. \r\n\r\n')
    requestBuffer = Buffer.concat([requestBuffer, data], requestBuffer.length + data.length)
    if (requestBuffer.includes('\r\n\r\n')) {
      reqObj = requestParser(requestBuffer)
      if (reqObj.headers['Content-length'] === undefined || parseInt(reqObj.headers['Content-Length']) === reqObj.body.length) {
        requestHandler(reqObj, socket)
        requestBuffer = Buffer.from([])
        reqObj = {}
      }
    }
  })
  socket.on('end', () => {
    console.log('Connection closed')
  })
}

function requestHandler (obj, socket) {
  obj['handlers'] = handlers
  obj['socket'] = socket
  let request = obj
  let response = createResponseObject(request)
  next(request, response)
}

function createResponseObject (newRequestObject) {
  return new Response(newRequestObject)
}

function addHandler (handler) {
  handlers.push(handler)
}

var routes = {
  GET: {},
  POST: {}
}

function addRoute (route, method, callbackFunc) {
  routes[method][route] = callbackFunc
}

function next (request, response) {
  addHandler(methodHandler)
  let handler = request.handlers.shift()
  handler(request, response, next)
}

var methodHandler = (request, response) => {
  if (routes[request.method].hasOwnProperty(request.uri)) {
    routes[request.method][request.uri](request, response)
  }
}

function requestParser (requestString) {
  var request = {}
  var lines = requestString.toString().split(/\r\n/)
  var parsedRequestStringLine = parseRequestString(lines.shift())
  request['method'] = parsedRequestStringLine['method']
  request['uri'] = parsedRequestStringLine['uri']
  request['protocol'] = parsedRequestStringLine['protocol']
  var headerLines = []
  while (lines.length) {
    let line = lines.shift()
    if (line === '') break
    headerLines.push(line)
  }
  request['headers'] = parseHeaders(headerLines)
  request['body'] = lines.join('\r\n')
  return request
}

function parseRequestString (lines) {
  var section = lines.toString().split(' ')
  var parsedLineObject = {}
  parsedLineObject['method'] = section.shift()
  parsedLineObject['uri'] = section.shift()
  parsedLineObject['protocol'] = section.join()
  return parsedLineObject
}

function parseHeaders (headerString) {
  var headers = {}
  for (let line of headerString) {
    let parts = line.split(':')
    let key = parts.shift()
    headers[key] = parts.join(':').trim()
  }
  return headers
}

module.exports = {
  create,
  addHandler,
  addRoute
}
