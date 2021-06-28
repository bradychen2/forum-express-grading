const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: async (req, res, next, callback) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      let category = undefined
      if (req.params.id) {
        category = await Category.findByPk(req.params.id)
      }
      if (category) {
        category = category.toJSON()
      }
      callback({ categories: categories, category })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = categoryService