const express = require('express')
const { signup, activateEmail, signin, getAccessToken, signout } = require('../controllers/auth')
const { getGoogleAuthControl, deliverOauthInfo, deliverOauthToken } = require('../controllers/oauth')

const router = express.Router()

// auth
router.post('/signup', signup)
router.post('/activation', activateEmail)
router.post('/signin', signin)
router.get('/access-token', getAccessToken)
router.get('/signout', signout)

// Oauth
router.get('/auth/google/url', getGoogleAuthControl)
router.get('/auth/google', deliverOauthToken)
router.get('/auth/me', deliverOauthInfo)

module.exports = router
