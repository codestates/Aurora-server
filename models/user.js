const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
  data: Buffer,
  contentType: String
})

// Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'please write your user name']
  },
  email: {
    type: String,
    required: [true, 'please write your email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'please write your password']
  },
  bio: {
    type: String
  },
  avatar: {
    type: [ImageSchema]
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'post'
    }
  ],
  likes: [
    {
      type: String
    }
  ]
}, {
  timestamps: true
})

const User = mongoose.model('user', UserSchema)

module.exports = User
