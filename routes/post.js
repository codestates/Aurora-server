const express = require('express')
const { createPost } = require('../controllers/post')

const router = express.Router()

router.post('/post/new', createPost)

module.exports = router
