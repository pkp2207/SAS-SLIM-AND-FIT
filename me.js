// //TWILIO
// const accountSid = 'AC2432ec38ded5be3df0578d9c77918fcf';
// const authToken = 'afaf98e80299af84c01583b3e886087c';
// const client = require('twilio')(accountSid, authToken);

// client.messages
//     .create({
//         body: 'Your appointment is coming up on laudeat 3PM',
//         from: 'whatsapp:+14155238886',
//         to: 'whatsapp:+916387488465'
//     })
//     // .done();



const express = require('express');
const app = express();
const bp = require('body-parser');
const user = require('./models/userschema.js');
const mongoose = require('mongoose');
const path = require('path');
const accountSid = 'AC2432ec38ded5be3df0578d9c77918fcf';
const authToken = 'afaf98e80299af84c01583b3e886087c';
const client = require('twilio')(accountSid, authToken);
const mongoDB = 'mongodb+srv://httwarriors12:akshat@cluster0.n9sknas.mongodb.net/hacktt';
mongoose.connect(mongoDB);

app.use(bp.urlencoded({extended:true}));
app.use(express.static(__dirname ));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));

const { auth } = require('express-openid-connect');
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000/',
  clientID: 'ouN2IFII0oE7eWZF3UgPaaaXuLe6nnK4',
  issuerBaseURL: 'https://dev-ktrnto3xhx5pfgg2.us.auth0.com'
};

let date = mongoose.model('Date', {msg:String, time:String});
let ndate = [];

async function akshat(){
   ndate = await date.find({});
}
akshat();

async function sendMessages() {
  while(1){
    var serverdate = new Date();
    
    // Add 5 hours and 30 minutes to convert to UTC+5:30
    serverdate.setHours(serverdate.getHours() + 5);
    serverdate.setMinutes(serverdate.getMinutes() + 30);
  console.log(serverdate);
    ndate.forEach(async (x) => {
      if(x.time < serverdate) {
        console.log('sent');
        await client.messages.create({
          body: x.msg,
          from: 'whatsapp:+14155238886',
          to: 'whatsapp:+916387488465'
        });
        
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 1 minute
  }
}
while(1){
sendMessages();
}
// Routes...

app.listen(3000, () => {
    console.log("listening on http://localhost:3000");
});
