const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const sendEmail = require('./sendEmail')

dotenv.config()

exports.signup = async (req, res) => {
  try {
    const { username, email, password, passwordconfirm } = req.body

    if (!username || !email || !password || !passwordconfirm) {
      return res.status(400).json({ message: 'please fill in all inputs' })
    }

    if (!validateEmail(email)) {
      return res.status(409).json({ message: 'Invalid email format' })
    }
    if (!validatePassword(password)) {
      return res.status(409).json({ message: 'Invalid password format 4자 이상 12자 이하 이면서, 알파벳과 숫자 및 특수문자(!@#$%^&*)만 사용할수 있습니다.' })
    }
    if (password !== passwordconfirm) {
      return res.status(409).json({ message: '비밀번호가 서로 다릅니다.' })
    }
    if (!validateUserName(username)) {
      return res.status(409).json({ message: 'Invalid username format 12자 이하 이면서, 알파벳과 숫자 및 특수문자(!@#$%^&*)만 사용할수 있습니다.' })
    }

    const existingUser = await User.findOne({ email }).lean()

    if (email === existingUser.email) {
      return res.status(409).json({ message: 'email already exists' })
    }
    if (username === existingUser.username) {
      return res.status(409).json({ message: 'username already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 20)

    const newUser = {
      username,
      email,
      password: hashedPassword
    }

    const activationToken = createActivationToken(newUser)

    const url = `http://localhost:3000/user/activation/${activationToken}`

    sendEmail(url, email)

    res.status(200).json({ message: 'signup success! please activate your email' })
  } catch (err) {
    return res.status(500).json({ message: 'server error' })
  }
}

exports.activateEmail = async (req, res) => {
  try {
    const { activationToken } = req.body
    const user = jwt.verify(activationToken, process.env.ACTIVATION_SECRET_KEY)
    const { username, email, password } = user
    const newUser = new User({ username, email, password })
    newUser.save()
    res.json({ msg: 'success !!' })
  } catch (e) {
    return res.status(500).send({ message: 'server error' })
  }
}

exports.signin = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'please fill in all inputs' })
  }

  const user = await User.findOne({ email }).lean()
  if (!user) {
    return res.status(401).send({ message: 'Invalid email' })
  }

  const isPassordCorrect = await bcrypt.compare(password, user.password)
  if (!isPassordCorrect) {
    return res.status(401).send({ message: 'Wrong password' })
  }
  const refreshToken = createRefreshToken(user)
  sendRefreshToken(res, refreshToken)
  return res.status(200).json({ message: 'login success' })
}

exports.deliverAccessToken = (req, res) => {

}

const validateEmail = (email) => {
  return /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/.test(email)
}

const validatePassword = (password) => {
  return /^[a-zA-z0-9!@#$%^&*]{4,12}$/.test(password)
}

const validateUserName = (username) => {
  return /^[a-zA-z0-9!@#$%^&*]{1,12}$/.test(username)
}

const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_SECRET_KEY, { expiresIn: '1d' })
}

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: '1d' })
}

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, { expiresIn: '7d' })
}

const sendRefreshToken = (res, refreshToken) => {
  res.cookie('authorization', refreshToken, {
    path: '/api/refresh_token',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7일
  })
}

const sendAccessToken = (res, accessToken) => {
  res.json({ data: { accessToken }, message: 'ok' })
}
