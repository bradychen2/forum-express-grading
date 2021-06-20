const db = require('../models')
const restaurant = require('../models/restaurant')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const User = db.User

const adminController = {
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({ raw: true })
      return res.render('admin/users', { users })
    } catch (err) {
      console.log(err)
      res.json(err)
    }
  },

  toggleAdmin: async (req, res) => {
    try {
      let user = await User.findByPk(req.params.id)
      console.log(user)
      await user.update({ isAdmin: user.isAdmin ? false : true })
      req.flash('success_msgs', 'users was successfully updated')
      return res.redirect('/admin/users')
    } catch (err) {
      console.log(err)
      res.json(err)
    }
  },

  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('error_msgs', 'Name is required')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name, tel, address, opening_hours, description,
          image: file ? img.data.link : null
        })
          .then(restaurant => {
            req.flash('success_msgs', 'Restaurant was successfully created')
            return res.redirect('/admin/restaurants')
          })
      })
    } else {
      return Restaurant.create({
        name, tel, address, opening_hours, description, image: null
      })
        .then(restaurant => {
          req.flash('success_msgs', 'Restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
    }
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        return res.render('admin/restaurant', { restaurant })
      })
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        return res.render('admin/create', { restaurant })
      })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msgs', 'Name is required')
      return res.redirect('back')
    }
    const { name, tel, address, opening_hours, description } = req.body
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then(restaurant => {
            restaurant.update({
              name, tel, address, opening_hours, description,
              image: file ? img.data.link : restaurant.image
            })
          })
          .then(restaurant => {
            req.flash('success_msgs', 'restaurant was successfully updated')
            res.redirect('/admin/restaurants')
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then(restaurant => {
          restaurant.update({
            name, tel, address, opening_hours, description, image: restaurant.image
          })
        })
        .then(restaurant => {
          req.flash('success_msgs', 'restaurant was successfully updated')
          res.redirect('/admin/restaurants')
        })
    }
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
  }
}

module.exports = adminController