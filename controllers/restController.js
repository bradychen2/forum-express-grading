db = require('../models')
Restaurant = db.Restaurant
Category = db.Category
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }

    if (req.query.categoryId) {
      // Transform to Number for sequelize query
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }

    return Restaurant.findAndCountAll({
      raw: true,
      nest: true,
      include: [Category],
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(results => {
      const page = req.query.page || 1 // url no params, default page 1
      // Cal how much pages
      const pages = Math.ceil(results.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 < pages ? pages : page + 1

      // Cut description to length-50 and add categoryName for render
      const data = results.rows.map(r => {
        return {
          ...r,
          description: r.description.substring(0, 50),
          categoryName: r.Category.name
        }
      })
      return Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          page, totalPage, prev, next
        })
      })
    })
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    })
      .then(restaurant => {
        res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
  }
}

module.exports = restController