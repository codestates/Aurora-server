const express = require('express')
const auth = require('../middleware/auth')
const { getAllMoods, getUserMoods } = require('../controllers/mood')

const router = express.Router()

router.get('/today-moods', getAllMoods)
router.get('/moods', auth, getUserMoods)

module.exports = router
