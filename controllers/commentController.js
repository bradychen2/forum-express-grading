const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: async (req, res, next) => {
    try {
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: req.user.id
      })
      return res.redirect(`/restaurants/${req.body.restaurantId}`)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  deleteComment: async (req, res, next) => {
    try {
      const comment = await Comment.findByPk(req.params.id)
      await comment.destroy()
      return res.redirect(`/restaurants/${comment.RestaurantId}`)
    } catch {
      console.log(err)
      next(err)
    }
  }
}

module.exports = commentController