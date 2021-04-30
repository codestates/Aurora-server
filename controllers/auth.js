const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

dotenv.config()

const User = require('../models/user')

function checkMail (email) {
  return /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/.test(email)
}

function checkPassword (password) {
  return /^[a-zA-z0-9!@#$%^&*]{4,12}$/.test(password)
}

function checkUserName (username) {
  return /^[a-zA-z0-9!@#$%^&*]{1,12}$/.test(username)
}

exports.signup = async (req, res) => {
  try {
    const { username, email, password, passwordconfirm } = req.body

    if (!username || !email || !password || !passwordconfirm) {
      return res.status(400).json({ message: 'please fill in all inputs' })
    }

    if (!checkMail(email)) { return res.status(409).json({ message: 'Invalid email format' }) }
    if (!checkPassword(password)) { return res.status(409).json({ message: 'Invalid password format 4자 이상 12자 이하 이면서, 알파벳과 숫자 및 특수문자(!@#$%^&*)만 사용할수 있습니다.' }) }
    if (password !== passwordconfirm) { return res.status(409).json({ message: '비밀번호가 서로 다릅니다.' }) }
    if (!checkUserName(username)) { return res.status(409).json({ message: 'Invalid username format 12자 이하 이면서, 알파벳과 숫자 및 특수문자(!@#$%^&*)만 사용할수 있습니다.' }) }

    const emailcheck = await User.findOne({ email })
    if (emailcheck) { return res.status(409).json({ message: 'email already exists' }) }

    const namecheck = await User.findOne({ username })
    if (namecheck) { return res.status(409).json({ message: 'username already exists' }) }

    const newUser = new User({ username, email, password })
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) return res.status(500).send({ message: 'server error' })
        // 가상필드로 패스워드 생성
        newUser.password = hash
        newUser.save()
        res.status(200).send({ message: 'signup success! please activate your email' })
      })
      if (err) { return res.status(500).send({ message: 'server error' }) }
    })
  } catch (err) {
    return res.status(500).send({ message: 'server error' })
  }
}
