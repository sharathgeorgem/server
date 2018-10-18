function typePlainText (req, res, next) {
  if (req.headers['Content-Type'] === 'text/plain') {
    req.body = req.body.toString()
  }
  next(req, res)
}

function typeJSON (req, res, next) {
  if (req.headers['Content-Type'] === 'application/json') {
    req.body = JSON.parse(req.body)
  }
  next(req, res)
}

function typeURLEncoded (req, res, next) {
  if (req.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    let urlValues = req.body.split('&')
    let urlParsed = {}
    urlValues.map(function (element) {
      let keyVal = element.split('=')
      urlParsed[keyVal[0]] = urlParsed[keyVal[1]]
    })
    req.body = urlParsed
  }
  next(req, res)
}
