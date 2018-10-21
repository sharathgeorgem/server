var status = {
  200: 'OK'
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
    resStr += this.version + ' ' + this.statusCode + ' ' + this.statusMessage + '\n'
    return resStr
  }
  send () {
    if (this.body !== undefined) {
      this.headers['Content-Length'] = (typeof this.body !== 'string')
        ? this.body.byteLength
        : this.body.length
    }
    this.socket.write(this.responseStringGen(), (error) => {
      if (error) console.log('Error in write ', error)
      if (this.body !== undefined) {
        this.socket.write('Response is ' + JSON.stringify(this.headers) + '\n' + this.body + '\n', err => {
          if (err) console.log('Error in write', err)
          console.log('Write completed')
          if (this.headers['Connection'] === 'close') this.socket.close()
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
