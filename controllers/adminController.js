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
    adminService.postRestaurant(req, res, next, (data) => {
      if (data.status === 'error') {
        req.flash('error_msgs', data.message)
        return res.redirect('back')
      } else {
        req.flash('success_msgs', data.message)
        return res.redirect('/admin/restaurants')
      }
    })
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
    adminService.putRestaurant(req, res, next, (data) => {
      if (data.status === 'error') {
        req.flash('error_msgs', data.message)
        res.redirect('back')
      } else {
        req.flash('success_msgs', data.message)
        res.redirect('/admin/restaurants')
      }
    })
  },

  deleteRestaurant: (req, res, next) => {
    adminService.deleteRestaurant(req, res, next, (data) => {
      if (data.status === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },
}

module.exports = adminController