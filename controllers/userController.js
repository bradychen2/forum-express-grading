const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: async (req, res) => {
    const { name, email, password } = req.body
    if (password != req.body.passwordCheck) {
      req.flash('error_msgs', '兩次輸入的密碼不同！')
      return res.redirect('/signup')
    }
    try {
      const user = await User.findOne({ where: { email } })
      if (user) {
        req.flash('error_msgs', '信箱重複！')
        return res.redirect('/signup')
      } else {
        const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        await User.create({ name, email, password: hash })
        req.flash('success_msgs', '成功註冊帳號！')
        return res.redirect('/signin')
      }
    } catch (err) {
      res.json(err)
      console.log(err)
    }
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