const db = require('../models')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const Category = db.Category

const imgurUpload = (file) => {
  return new Promise((resolve, reject) => {
    imgur.setClientID(IMGUR_CLIENT_ID)
    imgur.upload(file.path, (err, img) => {
      if (err) {
        reject(err)
      }
      resolve(img)
    })
  })
}

const fsUpload = (file) => {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(file.path, (err, data) => {
        fs.writeFile(`/upload/${file.originalname}`, data, () => {
          resolve(`/upload/${file.originalname}`)
        })
      })
    } catch (err) {
      reject(err)
    }
  })
}

const updateRest = (req, id, filePath = undefined) => {
  return new Promise((resolve, reject) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    Restaurant.findByPk(id)
      .then(restaurant => {
        return restaurant.update({
          name, tel, address, opening_hours, description,
          CategoryId: categoryId,
          image: filePath ? filePath : restaurant.image
        })
      })
      .then(() => resolve('updated OK'))
      .catch(err => reject(err))
  })
}

const createRest = (req, filePath = undefined) => {
  return new Promise((resolve, reject) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    Restaurant.create({
      name, tel, address, opening_hours, description,
      CategoryId: categoryId,
      image: filePath ? filePath : null
    })
      .then(() => resolve('created OK'))
      .catch(err => reject(err))
  })
}


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
      if (!req.body.name) {
        return callback({ status: 'error', message: 'name is required' })
      }
      const { file } = req

      if (file) {
        const filePath = await fsUpload(file)
        console.log(await createRest(req, filePath))
        return callback({ status: 'success', message: 'Restaurant was successfully created' })
      } else {
        console.log(await createRest(req))
        return callback({ status: 'success', message: 'Restaurant was successfully created' })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  putRestaurant: async (req, res, next, callback) => {
    try {
      if (!req.body.name) {
        return callback({ status: 'error', message: 'name is required' })
      }
      const { file } = req

      if (file) {
        const filePath = await fsUpload(file)
        console.log(await updateRest(req, req.params.id, filePath))
        return callback({ status: 'success', message: 'Restaurant was successfully updated' })
      } else {
        console.log(await updateRest(req, req.params.id))
        return callback({ status: 'success', message: 'Restaurant was successfully updated' })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = adminService