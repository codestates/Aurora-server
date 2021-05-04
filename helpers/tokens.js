const jwt = require('jsonwebtoken')

exports.createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_SECRET_KEY, { expiresIn: '1d' })
}

exports.verifyActivationToken = (activationToken) => {
  return jwt.verify(activationToken, process.env.ACTIVATION_SECRET_KEY)
}

exports.createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, { expiresIn: '7d' })
}

exports.verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY)
}

exports.setRefreshTokenToCookie = (res, refreshToken) => {
  res.cookie('RefreshToken', refreshToken, {
    path: '/api/access-token',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7일
  })
}

exports.createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: '1d' })
}

exports.verifyAccessToken = (accessToken) => {
  return jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY)
}
