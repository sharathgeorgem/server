var path = require('path')

var status = {
  200: 'OK'
}

var mimeTypes = {
  '.html': 'text/html'
}

class Response {
  constructor (request) {
    this.version = 'HTTP/1.1'
    this.statusCode = 200
    this.statusMessage = status[this.statusCode]
    this.socket = request.socket
    this.headers = {}
    this.request = request
  }
  responseStringGen () {
    let resStr = ''
    resStr += this.version + ' ' + this.statusCode + ' ' + this.statusMessage + '\r\n\r\n'
    return resStr
  }
  setContentType (url) {
    let ext = path.extname(url)
    this.headers['Content-Type'] = mimeTypes[ext]
  }
  send () {
    console.log('SEND')
    // let res = 'HTTP/1.1 200 OK\r\n\r\nHello world\r\n'
    if (this.body !== undefined) {
      this.headers['Content-Length'] = (typeof this.body !== 'string')
        ? this.body.byteLength
        : this.body.length
    }
    this.socket.write(this.responseStringGen(), (err) => {
      if (err) console.log('Error in write ', err)
      if (this.body !== undefined) {
        this.socket.write(/* this.headers + '\n' + */this.body + '\r\n', err => {
          if (err) console.log('Error in write', err)
          console.log('Write completed')
          // console.log('The body to be written is ', this.body)
          this.socket.end()
        })
      }
    })
  }
  setHeaders () {
    this.headers['Date'] = new Date()
    this.headers['Connection'] = this.request.headers['Connection'] || 'keep-alive'
  }
}

module.exports = Response
