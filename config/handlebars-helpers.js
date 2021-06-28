const moment = require('moment')

module.exports = {
  ifCond: function (a, b, options) {
    if (a == b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },

  moment: function (absoluteTime) {
    return moment(absoluteTime).fromNow()
  },
}