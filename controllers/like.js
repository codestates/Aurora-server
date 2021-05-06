const User = require('../models/user')

exports.getAllLikes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('likes')
    res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

exports.addLikes = async (req, res) => {
  try {
    const postId = req.body.id
    await User.findByIdAndUpdate(req.user.id, { $push: { likes: postId } }).exec()
    return res.status(200).json({ message: '좋아요가 정상적으로 추가되었습니다' })
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

exports.deleteLikes = async (req, res) => {
  try {
    const postId = req.body.id
    await User.findByIdAndUpdate(req.user.id, { $pull: { likes: postId } }).exec()
    return res.status(200).json({ message: '좋아요가 정상적으로 삭제되었습니다' })
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}
