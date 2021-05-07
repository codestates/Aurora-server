const express = require('express')
const auth = require('../middleware/auth')
const postById = require('../middleware/postById')
const commentById = require('../middleware/commentById')
const commenter = require('../middleware/commenter')
const { createComment, updateComment, deleteComment } = require('../controllers/comment')

const router = express.Router()

router.post('/comment/:postId', auth, createComment)
router.patch('/comment/:commentId', auth, commenter, updateComment)
router.delete('/post/:postId/comment/:commentId', auth, commenter, deleteComment)

router.param('postId', postById)
router.param('commentId', commentById)

module.exports = router
