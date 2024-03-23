const express = require('express');
const app = express();
const bp = require('body-parser');
const user = require('./models/userschema.js');
const mongoose = require('mongoose');
const path = require('path');
const mongoDB = 'mongodb+srv://httwarriors12:akshat@cluster0.n9sknas.mongodb.net/hacktt';
mongoose.connect(mongoDB);

app.use(bp.urlencoded({extended:true}));
app.use(express.static(__dirname ));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));

// var nu = new user({name:"fhkgf",email:"ghj",phno:"985585"});
// nu.save();
const { auth } = require('express-openid-connect');
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000/',
  clientID: 'ouN2IFII0oE7eWZF3UgPaaaXuLe6nnK4',
  issuerBaseURL: 'https://dev-ktrnto3xhx5pfgg2.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
const { requiresAuth } = require('express-openid-connect');
app.get('/', (req, res) => {
  
  res.send(req.oidc.isAuthenticated() ? res.render('homepage.ejs') : res.render('once.ejs'));
});


app.get("/admin", async (req, res) => {
  // res.render("index");
  let totalUsers = await user.find({});
  console.log(totalUsers);
  res.render("index.ejs",{totalUsers});
})

app.get('/profile', requiresAuth(), async(req, res) => {
    var datar = req.oidc.user;
    //res.send(datar.email);
    
        console.log(datar.email);
    let a=await user.find({email:datar.email});
    console.log(a);
    res.render('index.ejs',{a:a}) 
  });

app.listen(3000,()=>{
    console.log("listening on http://localhost:3000");
})



//TWILIO
// const accountSid = 'AC2432ec38ded5be3df0578d9c77918fcf';
// const authToken = '[AuthToken]';
// const client = require('twilio')(accountSid, authToken);

// client.messages
//     .create({
//         body: 'Your appointment is coming up on July 21 at 3PM',
//         from: 'whatsapp:+14155238886',
//         to: 'whatsapp:+916387488465'
//     })
//     .then(message => console.log(message.sid))
//     .done();