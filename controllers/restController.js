const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10

const restController = {
  getRestaurants: async (req, res, next) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    if (req.query.categoryId) {
      // req.query.categoryId is String type
      // Transform to Number for sequelize query
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }

    try {
      const results =
        await Restaurant.findAndCountAll({
          raw: true,
          nest: true,
          include: [Category],
          where: whereQuery,
          offset: offset,
          limit: pageLimit
        })
      // url no params, default page 1
      const page = Number(req.query.page) || 1
      // Cal how much pages
      const pages = Math.ceil(results.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = (page + 1 > pages) ? pages : page + 1
      // Cut description to length-50 and add categoryName for render
      const data = results.rows.map(r => {
        return {
          ...r, // spread operator
          description: r.description.substring(0, 50),
          categoryName: r.Category.name
        }
      })
      const categories =
        await Category.findAll({
          raw: true,
          nest: true
        })
      return res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        page, totalPage, prev, next
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restaurant =
        await Restaurant.findByPk(req.params.id, {
          include: [
            Category,
            { model: Comment, include: [User] }
          ]
        })
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = restController