const express = require('express')
const router = express.Router()
const adminController = require('../controllers/api/adminController')

const middle = (req, res, next) => {
  console.log('Hello')
  return next()
}

router.get('/admin/restaurants', middle, adminController.getRestaurants)

module.exports = router