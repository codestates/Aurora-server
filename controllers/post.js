const Post = require('../models/post')
const { IncomingForm } = require('formidable')
const fs = require('fs')

exports.createPost = (req, res, next) => {
  // maxFieldsSize === default 20mb
  const formOptions = {
    multiples: true,
    keepExtensions: true
  }
  const form = new IncomingForm(formOptions)

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: `Post upload error, ${err}`
      })
    }
    const imageFiles = files['images[]']

    if (!Array.isArray(imageFiles) && imageFiles.name === '') {
      return res.status(400).json({
        message: 'Please put images in your post'
      })
    }

    const newPost = new Post(fields)

    if (Array.isArray(imageFiles)) {
      imageFiles.forEach(image => {
        newPost.images.push({
          data: fs.readFileSync(image.path),
          contentType: image.type
        })
      })
    } else {
      newPost.images.push({
        data: fs.readFileSync(imageFiles.path),
        contentType: imageFiles.type
      })
    }

    newPost.save((err, result) => {
      if (err) {
        return res.status(400).json({ err })
      }
      res.status(201).json(result)
    })
  })
}

exports.getPostsByUser = (req, res) => {
  // test user id: 608d062ea5b357985c1f7aa8
  Post.find({ postedBy: req.user._id })
    .populate('postedBy', '-_id username')
    .sort({ createdAt: -1 })
    .lean()
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: 'Bad request'
        })
      }

      res.status(200).json(posts)
    })
}
