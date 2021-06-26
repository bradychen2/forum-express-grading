const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const bcrypt = require('bcryptjs')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, username, password, done) => {
  User.findOne({ where: { email: username } })
    .then(user => {
      if (!user) {
        return done(null, false, req.flash('error_msgs', '此帳號並未註冊！'))
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, req.flash('error_msgs', '帳號或密碼輸入錯誤！'))
      }
      return done(null, user)
    })
    .catch(err => done(err, false))
}
))

passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' }
    ]
  })
    .then(user => {
      user = user.toJSON()
      return done(null, user)
    })
})

module.exports = passport