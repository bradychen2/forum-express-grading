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
  }
}

module.exports = restController