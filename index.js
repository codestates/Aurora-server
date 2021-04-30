const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const postRoutes = require('./routes/post')

dotenv.config()

const app = express()

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

mongoose.connection
  .once('open', () => {
    console.log('MONGODB is connected')
  })
  .on('error', err => {
    console.log(`MONGODB connection error: ${err}`)
  })

app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

// routes
app.use('/api', postRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`)
})
