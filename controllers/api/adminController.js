const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      return res.json({ restaurants })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = adminController