const { database } = require('faker/locale/az')
const db = require('../models')
const categoryService = require('../services/categoryService')
const Category = db.Category

const categoryController = {
  getCategories: (req, res, next) => {
    categoryService.getCategories(req, res, next, (data) => {
      return res.render('admin/categories', data)
    })
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