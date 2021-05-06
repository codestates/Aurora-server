const Post = require('../models/post')

exports.getAllMoods = async (req, res) => {
  try {
    const allPosts = await Post.find({}).lean()

    const moods = {
      sun: 0,
      cloud: 0,
      rain: 0,
      moon: 0
    }

    if (allPosts.length) {
      allPosts.forEach(el => {
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
    }

    return res.status(200).json({ moods, total: allPosts.length })
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

    if (totalPosts.length) {
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
    }

    return res.status(200).json({ moods, total: totalPosts.length })
  } catch (error) {
    return res.status(500).json({ message: '서버 에러로 요청을 처리할 수 없습니다' })
  }
}
