const bcrypt = require('bcrypt')
const User = require('../models/user')

exports.validateSignUp = async (res, username, email, password, passwordconfirm) => {
  if (!(username && email && password && passwordconfirm)) {
    return res.status(400).json({ message: '모든 항목을 채워주세요.' })
  }
  if (password !== passwordconfirm) {
    return res.status(409).json({ message: '비밀번호가 서로 다릅니다.' })
  }
  if (!validateEmail(email)) {
    return res.status(409).json({ message: '이메일 형식이 올바르지 않습니다.' })
  }
  if (!validatePassword(password)) {
    return res.status(409).json({ message: '잘못된 비밀번호 입니다.' })
  }
  if (!validateUserName(username)) {
    return res.status(409).json({ message: '유저네임은 12자 이하이어야 합니다.' })
  }

  const user = await User.findOne({ email }).lean()

  if (user) {
    return res.status(409).json({ message: '이미 가입된 이메일입니다.' })
  }
}

exports.validateSignInUser = async (res, email, password) => {
  if (!(email && password)) {
    return res.status(400).json({ message: '모든 항목을 채워주세요.' })
  }

  const user = await User.findOne({ email }).lean()

  if (!user) {
    return res.status(401).send({ message: '가입하지 않은 이메일입니다.' })
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    return res.status(401).send({ message: '잘못된 비밀번호 입니다.' })
  }

  return user
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
