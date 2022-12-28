require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const app = express()
const bodyParser = require('body-parser')

//npm i express twilio dotenv
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken)
//


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.static('public'))



let randomN_otp
let key_values = {}


app.get('/', (req, res) => {
  res.render("home.ejs")   
})



app.post('/verify', (req, res) => {
  let mobile_number = req.body.number //+65
  randomN_otp = Math.floor(Math.random() * 90000) + 10000; //random 5 digit code
  console.log(randomN_otp, mobile_number)

  
client.messages
.create({
   body: randomN_otp,
   from: process.env.TWILIO_TEST_NUMBER,
   to: mobile_number
 })
.then(message => console.log(message.sid, "hi"));
//this sends out the SMS
//but how to scale this for concurrent requests? 
//the 'correct' OTP will keep switching.
//1 way is save the OTP value to HP_no Key
//save into a session that expire after 5min
  key_values[mobile_number] = randomN_otp
  console.log(key_values)

  res.render("verify.ejs", {mobile_number: mobile_number})   
})


app.post('/verifying', (req, res) => {
  //but now how to save the input phone number to check correctly....
  //can use DB reate record each time OTP created
  //so have that unique ID to check key-value
  let input_otp =  req.body.code
  console.log(input_otp, randomN_otp)

  if (input_otp == randomN_otp) {
    res.send('success!')
  } else {
    res.send('wrong code!')
  }
}) 


app.listen(3003, () => {
  console.log('server running on port 3003!')
})


 
