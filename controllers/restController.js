db = require('../models')
Restaurant = db.Restaurant
Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      const data = restaurants.map(r => {
        return {
          ...r,
          description: r.description.substring(0, 50),
          categoryName: r.Category.name
        }
      })
      res.render('restaurants', { restaurants: data })
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