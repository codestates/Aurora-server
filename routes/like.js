const express = require('express')
const auth = require('../middleware/auth')
const { getAllLikes, getLikes, deleteLikes } = require('../controllers/like')

const router = express.Router()

router.get('/like', auth, getAllLikes)
router.post('/like', auth, getLikes)
router.delete('/like', auth, deleteLikes)

module.exports = router
