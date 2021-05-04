const Comment = require('../models/comment')
const User = require('../models/user')

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body

    if (!content.length) {
      return res.status(400).json({ message: '댓글을 작성할 수 없습니다' })
    }

    const user = await User.findById(req.user.id).select('_id username')

    const post = req.post
    const newComment = new Comment({
      content,
      commentedBy: user
    })

    post.comments.push(newComment)

    post.save((err, post) => {
      if (err) {
        return res.status(400).json({ message: '댓글을 저장하던 중, 에러가 발생했습니다' })
      }
      return res.status(200).json(newComment)
    })
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}
