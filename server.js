var net = require('net')
var Request = require('./modules/request')
var Response = require('./modules/response')

var handlers = []

var server = net.createServer()

server.on('connection', (socket) => {
  var remoteAddress = socket.remoteAddress + ':' + socket.remotePort
  console.log('Gentlemen! We have a new client at ' + remoteAddress)
  socket.on('data', (data) => {
    console.log('Data from client is ' + data)
    console.log('The request object is ' + JSON.stringify(requestParser(data), null, '\t'))
    socket.write('Hello client. \r\n\r\n')
  })

  dataHandler(socket)

  socket.on('end', () => {
    console.log('Connection closed')
  })
})
server.on('error', (err) => {
  console.log('Oh damn. An error ' + err)
})
server.listen(9000, () => {
  var serverAddress = server.address()
  console.log('The server that is I, listens on ' + serverAddress.port)
})

function dataHandler (socket) {
  let requestBuffer = Buffer.from([])
  let bodyBuffer = Buffer.from([])
  let receivedPart = false
  let reqObj = {}
  socket.on('data', (data) => {
    if (receivedPart) {
      bodyBuffer = Buffer.concat([bodyBuffer, data], bodyBuffer.length + data.length)
    }
    requestBuffer = Buffer.concat([requestBuffer, data], requestBuffer.length + data.length)
    if (requestBuffer.includes('\r\n\r\n')) {
      if (!receivedPart) {
        reqObj = requestParser(requestBuffer)
        let body = reqObj['body']
        bodyBuffer = Buffer.from(body)
        receivedPart = true
      }
      if (reqObj.headers['Content-length'] === undefined || parseInt(reqObj.headers['Content-Length']) === bodyBuffer.length) {
        requestHandler(reqObj, socket, bodyBuffer)
        requestBuffer = Buffer.from([])
        bodyBuffer = Buffer.from([])
        receivedPart = false
        reqObj = {}
      }
    }
  })
}

function requestHandler (obj, socket, body) {
  console.log('The obj is ' + JSON.stringify(obj))
  console.log('The socket is ' + socket)
  console.log('The body is ' + body)
  let request = createRequestObject(obj, socket)
}

function createRequestObject (requestObject, socket) {
  
}

function addHandler (handler) {
  handlers.push(handler)
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
