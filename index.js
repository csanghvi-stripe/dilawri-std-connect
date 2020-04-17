const express = require('express')
const path = require('path')
require('dotenv').config()


const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

var style = "display: inline-block; margin-bottom: 1px; background-image: linear-gradient(#28a0e5,#015e94); -webkit-font-smoothing: antialiased; border: 0; padding: 1px; height: 32px; border-radius: 4px;     box-shadow: 0 1px 0 rgba(0,0,0,.2); cursor: pointer;"
var style_span = "display: block; position: relative; padding: 0 12px; height: 30px; background: #1275ff; background-image: linear-gradient(#7dc5ee,#008cdd 85%,#30a2e4); font-size: 15px; line-height: 30px; color: #fff; font-weight: 700; font-family: Helvetica Neue,Helvetica,Arial,sans-serif; text-shadow: 0 -1px 0 rgba(0,0,0,.2); box-shadow: inset 0 1px 0 hsla(0,0%,100%,.25); border-radius: 3px; padding-left: 44px;"
console.log('SECRET KEY is %o', process.env.STRIPE_SECRET_KEY)

var oauthAccess = async function(authInfo){
    // Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const response = await stripe.oauth.token({
    grant_type: 'authorization_code',
    code: authInfo.code,
    });

    var connected_account_id = response.stripe_user_id;
    return connected_account_id
}


app.get('/test', (req, res) => {
    res.render('index', {
      title: 'Standard Connect',
      content: `Test`
    })
  })

app.get('/', (req, res) => {
    res.send(`<a href="https://connect.stripe.com/oauth/authorize?response_type=code&amp;client_id=ca_H3V8gmNuP0Z48BjOZ8EPeX4HQOhQH3Ta&amp;scope=read_write" class="connect-button" style=${style}><span style=${style_span}>Connect with Stripe</span></a>`)
})

app.get('/oauth', async (req, res) => {
    console.log('Req query code is %o', req.query.code)
    if (!req.query.code) { // access denied
        res.redirect('/?error=access_denied')
        return
      }
      const authInfo = {
        code: req.query.code
      }
     var connected_id = await oauthAccess(authInfo)
     console.log('Connected Account id is %o', connected_id)
     //res.sendFile(path.resolve('public/thanks.html'))
     res.render('index', {
        title: 'Standard Connect',
        content: `Account id is ${connected_id}`
      })
     
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`App listening on port ${port}`))


