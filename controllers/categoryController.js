const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })

      if (req.params.id) {
        const category = await Category.findByPk(req.params.id)
        return res.render('admin/categories', {
          category: category.toJSON(),
          categories
        })
      } else {
        return res.render('admin/categories', { categories })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  postCategory: async (req, res, next) => {
    if (!req.body.name) {
      req.flash('error_msgs', 'name didn\'t exist')
      return res.redirect('back')
    }
    try {
      await Category.create({ name: req.body.name })
      res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  putCategory: async (req, res, next) => {
    if (!req.body.name) {
      req.flash('error_msgs', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      try {
        const category = await Category.findByPk(req.params.id)
        await category.update({ name: req.body.name })
        return res.redirect('/admin/categories')
      } catch (err) {
        console.log(err)
        next(err)
      }
    }
  },

  deleteCategory: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      return res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = categoryController