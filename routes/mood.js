const express = require('express')
const auth = require('../middleware/auth')
const { getTodayMoods, getUserMoods } = require('../controllers/mood')

const router = express.Router()

router.get('/today-moods', getTodayMoods)
router.get('/moods', auth, getUserMoods)

module.exports = router
