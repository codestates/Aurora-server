const Post = require('../models/post')
const { IncomingForm } = require('formidable')
const fs = require('fs')

exports.createPost = (req, res, next) => {
  try {
    const formOptions = {
      multiples: true,
      keepExtensions: true
    }
    const form = new IncomingForm(formOptions)

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          message: '게시물을 올릴 수 없습니다'
        })
      }
      const imageFiles = files['images[]']

      if (!Array.isArray(imageFiles) && imageFiles.name === '') {
        return res.status(400).json({
          message: '게시물에 이미지를 넣어주세요'
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

      newPost.postedBy = req.user.id

      newPost.save()
        .then(() => {
          Post.findById(newPost._id)
            .populate('postedBy', '_id username')
            .lean()
            .exec((err, post) => {
              if (err) {
                return res.status(400).json({
                  message: '게시물이 존재하지 않습니다'
                })
              }
              return res.status(201).json({ post })
            })
        })
        .catch((err) => {
          if (err) {
            return res.status(400).json({ message: '게시물을 저장하던 중, 에러가 발생했습니다' })
          }
        })
    })
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

exports.getPosts = async (req, res) => {
  try {
    const page = req.query.page
    const postsPerPage = 5
    const totalPosts = await Post.find({ postedBy: req.user.id }).countDocuments()

    Post.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * postsPerPage)
      .limit(postsPerPage)
      .populate('postedBy', '_id username')
      .lean()
      .exec((err, posts) => {
        if (err) {
          return res.status(400).json({ message: '게시물들을 찾을 수 없습니다' })
        }
        res.status(200).json({
          posts,
          totalPosts
        })
      })
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

exports.updatePost = (req, res) => {
  try {
    const formOptions = {
      multiples: true,
      keepExtensions: true
    }
    const form = new IncomingForm(formOptions)
    const editingPost = req.post

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          message: '게시물을 수정할 수 없습니다'
        })
      }

      editingPost.set({ content: fields.content })

      editingPost.save((err, post) => {
        if (err) {
          return res.status(400).json({ message: '게시물을 수정하던 중, 에러가 발생했습니다' })
        }
        res.status(200).json(post)
      })
    })
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

exports.deletePost = (req, res) => {
  const post = req.post

  try {
    post.remove((err, post) => {
      if (err) {
        return res.status(400).json({ message: '게시물을 삭제하던 중, 에러가 발생했습니다' })
      }
      res.status(200).json({ message: '게시물이 정상적으로 삭제되었습니다' })
    })
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}
