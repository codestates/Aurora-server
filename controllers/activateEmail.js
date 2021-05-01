const nodemailer = require('nodemailer')
const { google } = require('googleapis')

// These id's and secrets should come from .env file.
const CLIENT_ID = '613002191251-rkmtdldck5cf2qbefv1v3um45ochqsok.apps.googleusercontent.com'
const CLEINT_SECRET = '6DPIvLewTnfhcOsI_hHRJMPu'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//041b_IAKS301aCgYIARAAGAQSNwF-L9IrkFl3PGFXJwiBWXQLKHKjMkdqDoOqMrI-BcH9-aVHxwhjCv8A2yPuXB-J_F--trHayoM'

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

exports.sendEmail = async (url, email) => {
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
    to: 'gkwlsdn95@naver.com',
    subject: 'Hello from gmail using API',
    html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
  }

  const result = await transport.sendMail(mailOptions)
  return result
}
