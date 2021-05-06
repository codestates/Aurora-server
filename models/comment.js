const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
  content: {
    type: String,
    trim: true
  },
  commentedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
}, {
  timestamps: true
})

const Comment = mongoose.model('comment', CommentSchema)

module.exports = Comment
