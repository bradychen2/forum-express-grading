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
    categoryService.postCategory(req, res, next, (data) => {
      if (data.status === 'error') {
        req.flash('error_msgs', data.message)
        return res.redirect('back')
      }
      req.flash('success_msgs', data.message)
      res.redirect('/admin/categories')
    })
  },

  putCategory: async (req, res, next) => {
    categoryService.putCategory(req, res, next, (data) => {
      if (data.status === 'error') {
        req.flash('error_msgs', data.message)
        return res.redirect('back')
      }
      req.flash('success_msgs', data.message)
      res.redirect('/admin/categories')
    })
  },

  deleteCategory: async (req, res, next) => {
    categoryService.deleteCategory(req, res, next, (data) => {
      req.flash('success_msgs', data.message)
      return res.redirect('/admin/categories')
    })
  }
}

module.exports = categoryController