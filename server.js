var net = require('net')

var server = net.createServer()

server.on('connection', (socket) => {
  var remoteAddress = socket.remoteAddress + ':' + socket.remotePort
  console.log('Gentlemen! We have a new client at ' + remoteAddress)

  socket.on('data', (data) => {
    console.log('Data from client is ' + data)
    socket.write('Hello client. You sent me \r\n\r\n')
  })
})

server.on('error', (err) => {
  console.log('Oh damn. An error ' + err)
})

server.listen(9000, () => {
  var serverAddress = server.address()
  console.log('The server that is I, listens on ' + serverAddress.port)
})
