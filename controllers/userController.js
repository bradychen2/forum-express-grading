const bcrypt = require('bcryptjs')
const db = require('../models')
const imgur = require('imgur-node-api')
const fs = require('fs')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: async (req, res, next) => {
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
      console.log(err)
      next(err)
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

  getUser: async (req, res, next) => {
    const restaurants = {}
    let countOfRestaurants = 0
    try {
      let user = await User.findByPk(req.params.id, {
        include: [{
          model: Comment,
          include: [Restaurant]
        }]
      })
      user = user.toJSON()

      user.Comments.forEach((comment) => {
        if (!restaurants[comment.Restaurant.id]) {
          restaurants[comment.Restaurant.id] = comment.Restaurant.image
          countOfRestaurants += 1
        }
      })

      // Get array of object which contains restaurants' ids and images
      let restImgs = Object.keys(restaurants).map(id => {
        return { id: id, image: restaurants[id] }
      })

      // How many restaurants the user has commented
      user.countOfRestaurants = countOfRestaurants
      return res.render('user', { user, restImgs })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      res.render('editUser', { user: user.toJSON() })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  putUser: async (req, res, next) => {
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
  },

  addFavorite: async (req, res, next) => {
    try {
      await Favorite.create({
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      })
      return res.redirect('back')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  removeFavorite: async (req, res, next) => {
    try {
      const favorite = await Favorite.findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        }
      })
      await favorite.destroy()
      return res.redirect('back')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  toggleLike: async (req, res, next) => {
    try {
      const like = await Like.findOne({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        }
      })
      if (like) {
        await like.destroy()
      } else {
        await Like.create({
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        })
      }
      return res.redirect('back')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
}

module.exports = userController