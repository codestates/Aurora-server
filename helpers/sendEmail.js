const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const dotenv = require('dotenv')

dotenv.config()

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REFRESH_TOKEN,
  REDIRECT_URI
)

const sendEmail = async (url, email) => {
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
  const accessToken = await oAuth2Client.getAccessToken()

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'gkwlsdn95@gmail.com',
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken
    }
  })

  const mailOptions = {
    from: 'AURORA gkwlsdn95@gmail.com',
    to: email,
    subject: 'AURORA activation email',
    html: `Please click this link to confirm your email: <a style="font-size: 20px;" href="${url}">CLICK!</a>`
  }

  const result = await transport.sendMail(mailOptions)
  return result
}

module.exports = sendEmail
