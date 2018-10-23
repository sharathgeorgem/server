var fs = require('fs')
// var path = require('path')

function staticFileHandler (dir) {
  return (request, response, next) => {
    let url = dir + '/index.html'
    fs.readFile(url, (err, data) => {
      if (err) console.log('ERROR', err)
      response.body = data
      response.setHeaders()
      response.setContentType(url)
      response.send()
      next(request, response)
    })
  }
}

module.exports = {
  staticFileHandler
}
