const db = require('../models')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
  },

  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => {
        return res.render('admin/create', { categories })
      })
  },

  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
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
          CategoryId: categoryId,
          image: file ? img.data.link : null
        })
          .then(restaurant => {
            req.flash('success_msgs', 'Restaurant was successfully created')
            return res.redirect('/admin/restaurants')
          })
      })
    } else {
      return Restaurant.create({
        name, tel, address, opening_hours, description,
        image: null,
        CategoryId: categoryId
      })
        .then(restaurant => {
          req.flash('success_msgs', 'Restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
    }
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    })
      .then(restaurant => {
        return res.render('admin/restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
  },

  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id, {
        raw: true,
      })
        .then(restaurant => {
          return res.render('admin/create', {
            categories,
            restaurant
          })
        })
    })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msgs', 'Name is required')
      return res.redirect('back')
    }
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then(restaurant => {
            restaurant.update({
              name, tel, address, opening_hours, description,
              CategoryId: categoryId,
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
            name, tel, address, opening_hours, description,
            CategoryId: categoryId,
            image: restaurant.image
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
        return restaurant.destroy()
      })
      .then(restaurant => {
        console.log(restaurant)
        res.redirect('/admin/restaurants')
      })
  },

  getUsers: (req, res) => {
    return User.findAll()
      .then(users => {
        res.render('users', { users })
      })
      .catch(err => console.log(err))
  }
}

module.exports = adminController