const Post = require('../models/post')

const postById = (req, res, next, postId) => {
  try {
    Post.findById(postId)
      .populate('postedBy', '_id username')
      .exec((err, post) => {
        if (err) {
          return res.status(400).json({
            message: '게시물이 존재하지 않습니다'
          })
        }
        req.post = post

        next()
      })
  } catch (error) {
    return res.status(500).send({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

module.exports = postById
