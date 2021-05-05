const Post = require('../models/post')

exports.getTodayMoods = async (req, res) => {
  try {
    const now = new Date()
    const today = now.setHours(0, 0, 0, 0)
    const tomorrow = new Date(now.setDate(now.getDate() + 1)).setHours(0, 0, 0, 0)

    const todayPosts = await Post.find({
      $and: [
        { createdAt: { $gte: today } },
        { createdAt: { $lt: tomorrow } }
      ]
    }).lean()

    const moods = {
      sun: 0,
      cloud: 0,
      rain: 0,
      moon: 0
    }

    todayPosts.forEach(el => {
      switch (el.mood) {
        case 'sun':
          ++moods.sun
          break
        case 'cloud':
          ++moods.cloud
          break
        case 'rain':
          ++moods.rain
          break
        case 'moon':
          ++moods.moon
          break
        default:
          break
      }
    })

    return res.status(200).json({ moods, total: todayPosts.length })
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}

exports.getUserMoods = async (req, res) => {
  try {
    const totalPosts = await Post.find({ postedBy: req.user.id }).lean()

    const moods = {
      sun: 0,
      cloud: 0,
      rain: 0,
      moon: 0
    }

    totalPosts.forEach(el => {
      switch (el.mood) {
        case 'sun':
          ++moods.sun
          break
        case 'cloud':
          ++moods.cloud
          break
        case 'rain':
          ++moods.rain
          break
        case 'moon':
          ++moods.moon
          break
        default:
          break
      }
    })

    return res.status(200).json({ moods, total: totalPosts.length })
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}
