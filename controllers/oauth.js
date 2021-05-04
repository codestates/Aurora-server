const axios = require('axios')
const querystring = require('querystring')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const SERVER_ROOT_URI = 'http://localhost:5000'
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.CLEINT_SECRET
const CLIENT_ROOT_URI = 'http://localhost:3000'
const redirectURI = 'api/auth/google'
const { createRefreshToken, setRefreshTokenToCookie } = require('../helpers/tokens')

// Getting login URL
exports.getGoogleAuthControl = (req, res) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const options = {
    redirect_uri: `${SERVER_ROOT_URI}/${redirectURI}`,
    client_id: GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(' ')
  }
  return res.send(`${rootUrl}?${querystring.stringify(options)}`)
}

exports.deliverOauthToken = async (req, res) => {
  const code = req.query.code

  const tokenData = await getTokens(code)
  const accessToken = tokenData.access_token
  const idToken = tokenData.id_token
  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      console.error('Failed to fetch user')
      throw new Error(error.message)
    })
  const email = googleUser.email
  let existingUser = await User.findOne({ email }).lean()
  if (!existingUser) {
    const { name, email } = googleUser
    const hashedPassword = await bcrypt.hash(name + email, 10)
    const newUser = new User({ username: name, email, password: hashedPassword })
    await newUser.save()
    existingUser = newUser
  }

  const refreshToken = createRefreshToken({ id: existingUser._id })
  setRefreshTokenToCookie(res, refreshToken)

  res.redirect(CLIENT_ROOT_URI)
}

const getTokens = async (code) => {
  const url = 'https://oauth2.googleapis.com/token'
  const values = {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: `${SERVER_ROOT_URI}/${redirectURI}`,
    grant_type: 'authorization_code'
  }
  return axios
    .post(url, querystring.stringify(values), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error('Failed to fetch auth tokens')
      throw new Error(error.message)
    })
}
