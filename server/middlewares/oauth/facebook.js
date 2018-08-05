const {OAuth2} = require('oauth')

const STATE = 'd29n'

const consumer = new OAuth2(
  process.env.FACEBOOK_APP_ID,
  process.env.FACEBOOK_APP_SECRET,
  'https://graph.facebook.com',
)

module.exports = app => {
  app.get('/oauth/facebook/connect', async (req, res) => {
    const appId = process.env.FACEBOOK_APP_ID
    const url = process.env.FACEBOOK_REDIRECT_URL
    res.redirect(`https://www.facebook.com/v3.1/dialog/oauth?client_id=${appId}&redirect_uri=${url}&state=${STATE}`)
  })
  
  app.get('/oauth/facebook/callback', (req, res) => {
    consumer.getOAuthAccessToken(
      req.query.code,
      {redirect_uri: process.env.FACEBOOK_REDIRECT_URL},
      (error, token) => {
        if (error) return res.send('Error')
        req.session.facebookToken = token
        consumer.getProtectedResource(
          'https://graph.facebook.com/me',
          token,
          (error, data) => {
            if (error) return res.send('Error')
            req.session.facebookUser = JSON.parse(data)
            return res.redirect('/')
          }
        )
      }
    )
  })
}