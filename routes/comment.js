const express = require('express')
const auth = require('../middleware/auth')
const postById = require('../middleware/postById')
const { createComment } = require('../controllers/comment')

const router = express.Router()

router.post('/post/:postId/comment', auth, createComment)

router.param('postId', postById)

module.exports = router
