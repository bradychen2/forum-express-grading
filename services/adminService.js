const db = require('../models')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = {
  getRestaurants: async (req, res, next, callback) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      callback({ restaurants })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  getRestaurant: async (req, res, next, callback) => {
    try {
      const restaurant =
        await Restaurant.findByPk(req.params.id, {
          include: [Category]
        })
      callback({ restaurant: restaurant.toJSON() })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  deleteRestaurant: async (req, res, next, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.destroy()
      callback({ status: 'success', message: `successfully deleted restaurant: ${req.params.id}` })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  postRestaurant: async (req, res, next, callback) => {
    try {
      const { name, tel, address, opening_hours, description, categoryId } = req.body
      if (!name) {
        console.log(req.body)
        return callback({ status: 'error', message: 'name is required' })
      }
      const { file } = req

      if (file) {
        fs.readFile(file.path, (err, data) => {
          fs.writeFile(`upload/${file.originalname}`, data, async () => {
            await Restaurant.create({
              name, tel, address, opening_hours, description,
              CategoryId: categoryId,
              image: file ? `/upload/${file.originalname}` : null
            })
            return callback({ status: 'success', message: 'Restaurant was successfully created' })
          })
        })
        // imgur.setClientID(IMGUR_CLIENT_ID)
        // imgur.upload(file.path, async (err, img) => {
        //   await Restaurant.create({
        //     name, tel, address, opening_hours, description,
        //     CategoryId: categoryId,
        //     image: file ? img.data.link : null
        //   })
        //   return callback({ status: 'success', message: 'Restaurant was successfully created' })
        // })
      } else {
        await Restaurant.create({
          name, tel, address, opening_hours, description,
          image: null,
          CategoryId: categoryId
        })
        return callback({ status: 'success', message: 'Restaurant was successfully created' })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  putRestaurant: async (req, res, next, callback) => {
    try {
      const { name, tel, address, opening_hours, description, categoryId } = req.body
      if (!name) {
        return callback({ status: 'error', message: 'name is required' })
      }
      const { file } = req
      const restaurant = await Restaurant.findByPk(req.params.id)

      if (file) {
        fs.readFile(file.path, (err, data) => {
          fs.writeFile(`upload/${file.originalname}`, data, async () => {
            await restaurant.update({
              name, tel, address, opening_hours, description,
              CategoryId: categoryId,
              image: file ? `/upload/${file.originalname}` : restaurant.image
            })
            return callback({ status: 'success', message: 'Restaurant was successfully updated' })
          })
        })
        // imgur.setClientID(IMGUR_CLIENT_ID)
        // imgur.upload(file.path, async (err, img) => {
        //   await restaurant.update({
        //     name, tel, address, opening_hours, description,
        //     CategoryId: categoryId,
        //     image: file ? img.data.link : restaurant.image
        //   })
        //   return callback({ status: 'success', message: 'Restaurant was successfully created' })
        // })
      } else {
        await restaurant.update({
          name, tel, address, opening_hours, description,
          image: restaurant.image, CategoryId: categoryId
        })
        return callback({ status: 'success', message: 'Restaurant was successfully updated' })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = adminService