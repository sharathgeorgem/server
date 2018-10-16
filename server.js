var net = require('net')

var server = net.createServer()

server.on('connection', (socket) => {
  var remoteAddress = socket.remoteAddress + ':' + socket.remotePort
  console.log('Gentlemen! We have a new client at ' + remoteAddress)

  socket.on('data', (data) => {
    console.log('Data from client is ' + data)
    socket.write('Hello client. \r\n\r\n')
  })
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

function requestParser (requestString) {
  var request = {}
  var lines = requestString.split(/\r?\n/)

  var parsedRequestStringLine = parseRequestString(lines).shift()
  request['method'] = parsedRequestStringLine['method']
  request['uri'] = parsedRequestStringLine['uri']

  var headerLines = []
  while (lines.length) {
    let line = lines.shift()
    if (line === ' ') break
    headerLines.push(line)
  }

  request['headers'] = parseHeaders(headerLines)
  request['body'] = lines.join('\r\n')

  return request
}

function parseRequestString (lines) {
  var section = lines.split(' ')
  var parsed = {}
  parsed['method'] = section[0]
  parsed['uri'] = section[1]
  parsed['protocol'] = section[2]

  return parsed
}

function parseHeaders (headerString) {
  var headers = {}
  for (let line in headerString) {
    let parts = line.split(':')
    let key = parts.shift()
    headers[key] = parts.join(':').trim()
  }
  return headers
}