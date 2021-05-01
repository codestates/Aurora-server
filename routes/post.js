const express = require('express')
const { createPost, getPostsByUser } = require('../controllers/post')
const { userById } = require('../controllers/user')

const router = express.Router()

router.param('userId', userById)

router.post('/post/new', createPost)
router.get('/posts/by/:userId', getPostsByUser)

module.exports = router
