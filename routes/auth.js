const express = require('express')
const router = express.Router()

const { signup, activateEmail, signin, deliverAccessToken, deliverUserInfo, signout, deleteUserInfo } = require('../controllers/auth')
const { getGoogleAuthControl, deliverOauthInfo, deliverOauthToken } = require('../controllers/oauth')

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/refresh_token', deliverAccessToken)
router.post('/activation', activateEmail)
router.post('/delete_user_info', deleteUserInfo)
router.get('/deliver_user_info', deliverUserInfo)
router.get('/signout', signout)
// Oauth
router.get('/auth/google/url', getGoogleAuthControl)
router.get('/auth/google', deliverOauthToken)
router.get('/auth/me', deliverOauthInfo)
module.exports = router
