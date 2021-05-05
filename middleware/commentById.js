const Comment = require('../models/comment')

const commentById = (req, res, next, commentId) => {
  try {
    Comment.findById(commentId)
      .populate('commentedBy', '_id username')
      .exec((err, comment) => {
        if (err) {
          return res.status(400).json({
            message: '댓글이 존재하지 않습니다'
          })
        }
        req.comment = comment

        next()
      })
  } catch (error) {
    return res.status(500).send({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

module.exports = commentById
