const express = require('express')
const auth = require('../middleware/auth')
const poster = require('../middleware/poster')
const postById = require('../middleware/postById')
const { createPost, getPosts, updatePost, deletePost } = require('../controllers/post')

const router = express.Router()

router.post('/post', auth, createPost)
router.get('/posts', auth, getPosts)
router.patch('/post/:postId', auth, poster, updatePost)
router.delete('/post/:postId', auth, poster, deletePost)

router.param('postId', postById)

module.exports = router
