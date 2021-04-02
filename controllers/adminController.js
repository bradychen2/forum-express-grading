const db = require('../models')
const restaurant = require('../models/restaurant')
const Restaurant = db.Restaurant

const adminController = {
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
    return Restaurant.create({
      name, tel, address, opening_hours, description
    })
      .then(restaurant => {
        req.flash('success_msgs', 'Restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
  }
}

module.exports = adminController