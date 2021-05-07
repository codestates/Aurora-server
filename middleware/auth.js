const { verifyAccessToken } = require('../helpers/tokens')

const auth = async (req, res, next) => {
  try {
    const accessToken = req.header('Authorization')

    if (!accessToken) {
      return res.status(400).json({ message: '다시 로그인을 해주세요' })
    }

    const user = await verifyAccessToken(accessToken)

    req.user = user

    next()
  } catch (error) {
    return res.status(500).send({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

module.exports = auth
