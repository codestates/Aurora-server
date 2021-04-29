const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

dotenv.config()

const User = require('../models/user')

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'please fill in all inputs' })
    }

    const emailcheck = await User.findOne({ email })
    if (emailcheck) { return res.status(409).json({ message: 'email already exists' }) }

    const namecheck = await User.findOne({ username })
    if (namecheck) { return res.status(409).json({ message: 'username already exists' }) }

    const newUser = new User({ username, email, password })
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) return res.status(500).send({ message: 'server error' })

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
