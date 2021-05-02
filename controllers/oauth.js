const jwt = require('jsonwebtoken')
const axios = require('axios')
const querystring = require('querystring')

const SERVER_ROOT_URI = 'http://localhost:5000'
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID
const JWT_SECRET = process.env.REFRESH_SECRET_KEY
const GOOGLE_CLIENT_SECRET = process.env.CLEINT_SECRET
const COOKIE_NAME = 'Authorization'
const CLIENT_ROOT_URI = 'http://localhost:3000'

const redirectURI = 'api/auth/google'

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

exports.deliverOauthToken = async (req, res) => {
  const code = req.query.code

  const tokenData = await getTokens(code)
  const accessToken = tokenData.access_token
  const idToken = tokenData.id_token
  // Fetch the user's profile with the access token and bearer
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

  const token = jwt.sign(googleUser, JWT_SECRET)

  res.cookie(COOKIE_NAME, token, {
    maxAge: 900000,
    httpOnly: true,
    secure: false
  })

  res.redirect(CLIENT_ROOT_URI)
}

exports.deliverOauthInfo = (req, res) => {
  try {
    console.log(req.cookies)
    const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SECRET)
    console.log('decoded', decoded)
    return res.send(decoded)
  } catch (err) {
    console.log(err)
    res.send(null)
  }
}
