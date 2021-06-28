let routes = require('./routes')
let apis = require('./apis')

module.exports = (app) => {
  app.use('/', routes)
  app.use('/api', apis)

  // --------------------Error--------------------
  // 404 Not Found
  app.use((req, res, next) => {
    res.status(404)

    if (req.accepts('json')) {
      res.json({ error: '404 - Not Found' })
      return
    }
    res.type('text/plain').send('404 - Not Found')
  })

  // 500 Server Error
  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500)

    if (req.accepts('json')) {
      res.json({ error: '500 - Server Error' })
      return
    }
    res.type('text/plain').send('500 - Server Error')
  })
}