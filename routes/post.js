const express = require('express')
const { createPost, getPostsByUser } = require('../controllers/post')

const router = express.Router()

router.post('/post/new', createPost)
router.get('/posts/by/:userId', getPostsByUser)

module.exports = router
