const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res) => {
    const { name, email, password } = req.body
    if (password != req.body.passwordCheck) {
      req.flash('error_msgs', '兩次輸入的密碼不同！')
      return res.redirect('/signup')
    }
    User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          req.flash('error_msgs', '信箱重複！')
          return res.redirect('/signup')
        } else {
          const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          User.create({ name, email, password: hash })
            .then(user => {
              req.flash('success_msgs', '成功註冊帳號！')
              return res.redirect('/signin')
            })
        }
      })
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_msgs', '登入成功！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_msgs', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController