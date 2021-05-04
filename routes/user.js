const express = require('express')
const auth = require('../middleware/auth')
const { getUser, deleteUser, updateUser } = require('../controllers/user')

const router = express.Router()

router.get('/user', auth, getUser)
router.patch('/user', auth, updateUser)
router.delete('/user', auth, deleteUser)

module.exports = router
