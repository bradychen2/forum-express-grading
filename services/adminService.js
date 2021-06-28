const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = {
  getRestaurants: async (req, res, next, callback) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      callback({ restaurants })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  getRestaurant: async (req, res, next, callback) => {
    try {
      const restaurant =
        await Restaurant.findByPk(req.params.id, {
          include: [Category]
        })
      callback({ restaurant: restaurant.toJSON() })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = adminService