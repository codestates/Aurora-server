const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const dotenv = require('dotenv')

dotenv.config()

const CLIENT_ID = process.env.CLIENT_ID
const CLEINT_SECRET = process.env.CLEINT_SECRET
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
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
      clientId: CLIENT_ID,
      clientSecret: CLEINT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken
    }
  })

  const mailOptions = {
    from: 'SENDER NAME gkwlsdn95@gmail.com',
    to: email,
    subject: 'Hello from gmail using API',
    html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
  }

  const result = await transport.sendMail(mailOptions)
  return result
}

module.exports = sendEmail
