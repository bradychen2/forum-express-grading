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
  },

  postCategory: async (req, res, next, callback) => {
    try {
      if (!req.body.name) {
        return callback({ status: 'error', message: "name didn't exist" })
      } else {
        await Category.create({ name: req.body.name })
        return callback({ status: 'success', message: 'Category was created successfully!' })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  putCategory: async (req, res, next, callback) => {
    try {
      if (!req.body.name) {
        return callback({ status: 'error', message: "name didn't exist" })
      } else {
        const category = await Category.findByPk(req.params.id)
        await category.update({ name: req.body.name })
        return callback({ status: 'success', message: 'Category was updated successfully!' })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  deleteCategory: async (req, res, next, callback) => {
    try {
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      return callback({ status: 'success', message: 'Category was deleted successfully!' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
}

module.exports = categoryService