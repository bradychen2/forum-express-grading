db = require('../models')
Restaurant = db.Restaurant
Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      // Transform to Number for sequelize query
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }

    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category],
      where: whereQuery
    }).then(restaurants => {
      const data = restaurants.map(r => {
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
          categoryId
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