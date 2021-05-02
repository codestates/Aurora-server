const jwt = require('jsonwebtoken')

exports.isAuthorized = (req) => {
  const token = req.headers.Authorization
  if (!token) return null
  return jwt.verify(token, process.env.ACCESS_SECRET_KEY)
}
