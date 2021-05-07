const commenter = (req, res, next) => {
  try {
    const isSameUser = req.user.id === String(req.comment.commentedBy._id)

    if (!isSameUser) {
      return res.status(403).json({ message: '댓글 권한이 없습니다' })
    }

    next()
  } catch (error) {
    return res.status(500).send({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

module.exports = commenter
