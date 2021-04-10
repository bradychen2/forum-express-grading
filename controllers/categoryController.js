const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    if (req.params.id) {
      return Category.findByPk(req.params.id)
        .then(category => {
          return Category.findAll({
            raw: true,
            nest: true
          }).then(categories => {
            res.render('admin/categories', {
              category: category.toJSON(),
              categories
            })
          })
        })
    } else {
      return Category.findAll({
        raw: true,
        nest: true
      })
        .then(categories => {
          res.render('admin/categories', { categories })
        })
    }
  },

  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msgs', 'category name is necessary!')
      return res.redirect('back')
    }
    Category.create({ name: req.body.name })
      .then(category => {
        res.redirect('/admin/categories')
      })
  },

  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msgs', 'category name is necessary!')
    } else {
      return Category.findByPk(req.params.id)
        .then(category => {
          category.update({
            name: req.body.name
          })
            .then(category => {
              res.redirect('/admin/categories')
            })
        })
    }
  },

  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
          .then(category => {
            res.redirect('/admin/categories')
          })
      })
  }
}

module.exports = categoryController