const db = require('../models')
const adminService = require('../services/adminService')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true })
      return res.render('admin/users', { users })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  toggleAdmin: async (req, res, next) => {
    try {
      let user = await User.findByPk(req.params.id)
      await user.update({ isAdmin: user.isAdmin ? false : true })
      req.flash('success_msgs', 'users was successfully updated')
      return res.redirect('/admin/users')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  getRestaurants: async (req, res, next) => {
    adminService.getRestaurants(req, res, next, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  createRestaurant: async (req, res, next) => {
    try {
      const categories =
        await Category.findAll({
          raw: true,
          nest: true
        })
      return res.render('admin/create', { categories })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  postRestaurant: async (req, res, next) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!name) {
      req.flash('error_msgs', 'Name is required')
      return res.redirect('back')
    }
    const { file } = req
    try {
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          await Restaurant.create({
            name, tel, address, opening_hours, description,
            CategoryId: categoryId,
            image: file ? img.data.link : null
          })
          req.flash('success_msgs', 'Restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
      } else {
        await Restaurant.create({
          name, tel, address, opening_hours, description,
          image: null,
          CategoryId: categoryId
        })
        req.flash('success_msgs', 'Restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  getRestaurant: (req, res, next) => {
    adminService.getRestaurant(req, res, next, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  editRestaurant: async (req, res, next) => {
    try {
      const categories =
        await Category.findAll({
          raw: true,
          nest: true
        })
      const restaurant =
        await Restaurant.findByPk(req.params.id, {
          raw: true,
        })
      return res.render('admin/create', { categories, restaurant })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  putRestaurant: async (req, res, next) => {
    if (!req.body.name) {
      req.flash('error_msgs', 'Name is required')
      return res.redirect('back')
    }
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const { file } = req
    try {
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          const restaurant = await Restaurant.findByPk(req.params.id)
          await restaurant.update({
            name, tel, address, opening_hours, description,
            CategoryId: categoryId,
            image: file ? img.data.link : restaurant.image
          })
          req.flash('success_msgs', 'restaurant was successfully updated')
          res.redirect('/admin/restaurants')
        })
      } else {
        const restaurant = await Restaurant.findByPk(req.params.id)
        await restaurant.update({
          name, tel, address, opening_hours, description,
          CategoryId: categoryId,
          image: restaurant.image
        })
        req.flash('success_msgs', 'restaurant was successfully updated')
        res.redirect('/admin/restaurants')
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  deleteRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.destroy()
      return res.redirect('/admin/restaurants')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
}

module.exports = adminController