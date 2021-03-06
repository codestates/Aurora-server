const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
  data: Buffer,
  contentType: String
})

const PostSchema = new Schema({
  content: String,
  images: {
    type: [ImageSchema],
    required: [true, 'Please put images in the post']
  },
  mood: {
    type: String,
    trim: true
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comment'
    }
  ]
}, {
  timestamps: true
})

const Post = mongoose.model('post', PostSchema)

module.exports = Post
