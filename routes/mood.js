const express = require('express')
const { getTodayMoods } = require('../controllers/mood')

const router = express.Router()

router.get('/today-moods', getTodayMoods)

module.exports = router
