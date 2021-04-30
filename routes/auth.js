const express = require('express')
const router = express.Router()

const { signup, confirmEmail } = require('../controllers/auth')

router.post('/signup', signup)
router.post('/user/activation', confirmEmail)
module.exports = router
