const express = require('express')
const auth = require('../middleware/auth')
const { getAllLikes, addLikes, deleteLikes } = require('../controllers/like')

const router = express.Router()

router.get('/like', auth, getAllLikes)
router.post('/like', auth, addLikes)
router.delete('/like', auth, deleteLikes)

module.exports = router
