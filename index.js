const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

dotenv.config()

const app = express()

// Routes
const authRoutes = require('./routes/auth')

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
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

const PORT = process.env.PORT || 5000

// Use routes
app.use('/api', authRoutes)

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`)
})
