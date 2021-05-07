const User = require('../models/user')
const { IncomingForm } = require('formidable')
const fs = require('fs')

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

exports.updateUser = (req, res) => {
  const formOptions = {
    keepExtensions: true
  }
  const form = new IncomingForm(formOptions)

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: `사진 업로드 에러로 요청을 처리할 수 없습니다, ${err}`
      })
    }

    const userDetails = {}
    if (fields.bio) userDetails.bio = fields.bio
    if (fields.username) userDetails.username = fields.username

    if (Object.keys(files).length !== 0) {
      const imageFile = files.image
      userDetails.avatar = {
        data: fs.readFileSync(imageFile.path),
        contentType: imageFile.type
      }
    }
    await User.findByIdAndUpdate(req.user.id, userDetails).exec()
    const user = await User.findById(req.user.id).select('-password')
    if (!user.bio) user.bio = null
    if (!user.username) user.username = null
    res.status(200).json(user)
  })
}

exports.deleteUser = (req, res) => {
  try {
    User.findByIdAndDelete(req.user.id).exec()

    res.status(200).json({ message: '회원 탈퇴가 성공적으로 이루어졌습니다. 감사합니다' })
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}
