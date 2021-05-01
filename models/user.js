const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'please write your user name'],
    unique: true
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
    type: String
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'post'
    }
  ]
}, {
  timestamps: true
})

const User = mongoose.model('user', UserSchema)

module.exports = User
