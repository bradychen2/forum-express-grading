const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res) => {
    const { name, email, password } = req.body
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    User.create({ name, email, password: hash })
      .then(() => {
        return res.redirect('/signin')
      })
  }
}

module.exports = userController