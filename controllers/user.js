const User = require('../models/user')

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')

    res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

exports.deleteUser = (req, res) => {
  try {
    User.findByIdAndDelete(req.userId)

    res.status(200).json({ message: '회원 탈퇴가 성공적으로 이루어졌습니다. 감사합니다' })
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}
