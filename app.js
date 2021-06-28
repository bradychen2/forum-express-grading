const express = require('express')
const db = require('./models')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const helpers = require('./_helpers')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config
}
const passport = require('./config/passport')
const port = process.env.PORT || 3000

app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use('/upload', express.static(__dirname + '/upload'))
app.use((req, res, next) => {
  req.user = helpers.getUser(req)
  next()
})

app.use((req, res, next) => {
  res.locals.success_msgs = req.flash('success_msgs')
  res.locals.error_msgs = req.flash('error_msgs')
  res.locals.user = req.user
  next()
})

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
