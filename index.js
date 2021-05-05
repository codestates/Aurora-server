const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const postRoutes = require('./routes/post')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const commentRoutes = require('./routes/comment')

dotenv.config()

const app = express()

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
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(cookieParser())

// routes
app.use('/api', postRoutes)
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', commentRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`)
})
