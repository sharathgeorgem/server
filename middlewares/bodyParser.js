function typePlainText (request, response, next) {
  if (request.headers['Content-Type'] === 'text/plain') {
    request.body = request.body.toString()
  }
  next(request, response)
}

function typeJSON (request, response, next) {
  if (request.headers['Content-Type'] === 'application/json') {
    console.log(typeof request.body)
    request.body = JSON.stringify(request.body)
    request.body = JSON.parse(request.body)
  }
  next(request, response)
}

function typeURLEncoded (request, response, next) {
  if (request.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    let urlValues = request.body.split('&')
    let urlParsed = {}
    urlValues.map(function (val) {
      let keyVal = val.split('=')
      urlParsed[keyVal[0]] = urlParsed[keyVal[1]]
    })
    request.body = urlParsed
  }
  next(request, response)
}

module.exports = {
  typeJSON,
  typePlainText,
  typeURLEncoded
}
