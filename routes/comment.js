const express = require('express')
const auth = require('../middleware/auth')
const postById = require('../middleware/postById')
const commentById = require('../middleware/commentById')
const commenter = require('../middleware/commenter')
const { createComment, updateComment } = require('../controllers/comment')

const router = express.Router()

router.post('/post/:postId/comment', auth, createComment)
router.patch('/post/:postId/comment/:commentId', auth, commenter, updateComment)

router.param('postId', postById)
router.param('commentId', commentById)

module.exports = router
