const User = require('../models/user')

exports.userById = (req, res, next, id) => {
  // test user id: 608d062ea5b357985c1f7aa8
  User.findById(id)
    .select('-password')
    .lean()
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({
          error: 'User not exist'
        })
      }
      console.log('userById', user)
      req.user = user

      next()
    })
}
