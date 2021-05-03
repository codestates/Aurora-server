const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const User = require('../models/user')
const sendEmail = require('../helpers/sendEmail')
const { validateSignUp, validateSignInUser } = require('../validators')
const { createActivationToken, createRefreshToken, createAccessToken, verifyActivationToken, setRefreshTokenToCookie, verifyRefreshToken } = require('../helpers/tokens')

dotenv.config()

exports.signup = async (req, res) => {
  try {
    const { username, email, password, passwordconfirm } = req.body

    await validateSignUp(res, username, email, password, passwordconfirm)

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      username,
      email,
      password: hashedPassword
    }

    const activationToken = createActivationToken(newUser)

    const url = `http://localhost:3000/user/activation/${activationToken}`

    sendEmail(url, email)

    res.status(200).json({ message: '이메일을 인증하시면 회원 가입이 완료됩니다!' })
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

exports.activateEmail = (req, res) => {
  try {
    const { activationToken } = req.body

    const user = verifyActivationToken(activationToken)

    const { username, email, password } = user

    const newUser = new User({ username, email, password })

    newUser.save()

    res.json({ message: '회원 가입이 성공적으로 완료되었습니다!' })
  } catch (error) {
    return res.status(500).send({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await validateSignInUser(res, email, password)

    const refreshToken = createRefreshToken({ id: user._id })

    setRefreshTokenToCookie(res, refreshToken)

    return res.status(200).json({ message: '로그인 성공했습니다' })
  } catch (error) {
    return res.status(500).send({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

exports.getAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.RefreshToken

    if (!refreshToken) {
      return res.status(400).json({ message: '다시 로그인을 해주세요' })
    }

    const user = await verifyRefreshToken(refreshToken)

    if (!user) {
      return res.status(400).json({ message: '다시 로그인을 해주세요' })
    }

    const accessToken = createAccessToken({ id: user.id })

    res.status(200).json({ accessToken })
  } catch (error) {
    return res.status(500).send({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

exports.signout = (req, res) => {
  try {
    res.clearCookie('RefreshToken', { path: '/api/access-token' })

    return res.status(200).json({ message: '로그 아웃 했습니다' })
  } catch (error) {
    return res.status(500).send({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}
