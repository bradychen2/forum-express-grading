const { database } = require('faker/locale/cz')
const { datatype } = require('faker/locale/de_AT')
const adminService = require('../../services/adminService')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminService.getRestaurants(req, res, next, (data) => {
      return res.json(data)
    })
  },

  getRestaurant: (req, res, next) => {
    adminService.getRestaurant(req, res, next, (data) => {
      return res.json(data)
    })
  },

  deleteRestaurant: (req, res, next) => {
    adminService.deleteRestaurant(req, res, next, (data) => {
      return res.json(data)
    })
  },

  postRestaurant: (req, res, next) => {
    adminService.postRestaurant(req, res, next, (data) => {
      return res.json(data)
    })
  },

  putRestaurant: (req, res, next) => {
    adminService.putRestaurant(req, res, next, (data) => {
      return res.json(data)
    })
  }
}

module.exports = adminController