const bcrypt = require('bcryptjs')
const db = require('../models')
const imgur = require('imgur-node-api')
const fs = require('fs')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
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
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      res.render('user', { user: user.toJSON() })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  editUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      res.render('editUser', { user: user.toJSON() })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  putUser: async (req, res) => {
    const { name, image } = req.body
    const { file } = req
    if (!name) {
      req.flash('error_msgs', "name didn't exist")
      return res.redirect('back')
    }
    try {
      const user = await User.findByPk(req.params.id)

      if (file) {
        fs.readFile(file.path, async (err, data) => {
          fs.writeFile(`upload/${file.originalname}`, data, async () => {
            await user.update({
              name,
              image: file ? `/upload/${file.originalname}` : user.image
            })
          })
        })
        req.flash('success_msgs', 'user was successfully updated')
        return res.redirect(`/users/${req.params.id}`)
      } else {
        await user.update({ name, image })
        req.flash('success_msgs', 'user was successfully updated')
        return res.redirect(`/users/${req.params.id}`)
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = userController