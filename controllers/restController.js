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

      // Lists for judging Add/Remove favorites and Like/Unlike
      const favRestIdList = req.user.FavoritedRestaurants.map(f => f.id)
      const likedRestIdList = req.user.LikedRestaurants.map(l => l.id)

      const data = results.rows.map(r => {
        return {
          ...r, // spread operator
          // Cut description to length-50 and add categoryName for render
          description: r.description.substring(0, 50),
          categoryName: r.Category.name,
          isFavorited: favRestIdList.includes(r.id),
          isLiked: likedRestIdList.includes(r.id)
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
            { model: Comment, include: [User] },
            { model: User, as: 'FavoritedUsers' },
            { model: User, as: 'LikedUsers' }
          ]
        })
      await restaurant.increment('viewCounts')
      // Lists for judging Add/Remove favorites and Like/Unlike
      const isFavorited = restaurant.FavoritedUsers.map(u => u.id).includes(req.user.id)
      const isLiked = restaurant.LikedUsers.map(l => l.id).includes(req.user.id)

      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited,
        isLiked
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  getFeeds: async (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
    ]).then(([restaurants, comments]) => {
      return res.render('feeds', {
        restaurants: restaurants,
        comments: comments
      })
    }).catch(err => {
      console.log(err)
      next(err)
    })
  },

  getDashboard: async (req, res, next) => {
    try {
      let restaurant = await Restaurant.findByPk(req.params.id, {
        include: [Comment, Category]
      })
      restaurant = restaurant.toJSON()
      restaurant.countOfComments = restaurant.Comments.length
      return res.render('dashboard', { restaurant })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
}

module.exports = restController