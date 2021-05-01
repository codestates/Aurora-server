const express = require('express')
const router = express.Router()

const { signup, sendEmail, signin, deliverAccessToken } = require('../controllers/auth')

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/refresh_token', deliverAccessToken)
router.post('/activation', sendEmail)

module.exports = router
