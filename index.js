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
const methodOverride = require("method-override");
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
let date = mongoose.model('Date', {msg:String,time:String});
let nd = new date({msg:"dhatt teri maa ki chu",time:'2024-03-24T01:59:02.208Z'})
// nd.save();

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
app.use(methodOverride("_method"));
var serverdate = new Date();



// req.isAuthenticated is provided from the auth router
const { requiresAuth } = require('express-openid-connect');
app.get('/', async (req, res) => {
  let verified = req.oidc.isAuthenticated();
  if(!verified){
    res.render("once.ejs");
  } else{
    let data = req.oidc.user;
    let userdata = await user.find({email: data.email});
    // console.log(userdata);
   if(userdata.length == 0) {
    res.redirect("/details");
   }else{
    let userInfo = req.oidc.user;
    // console.log(userInfo);
    let photo = userInfo.picture;
    let userData = await user.find({email:userInfo.email});
    console.log(userData);
     res.render("homepage.ejs",{userData:userData,photo:photo});
   }
  }
});

app.get('/details', async (req, res) => {
  if(!req.oidc.isAuthenticated()){
    res.redirect("/login");
  }else{
    res.render("aftersignup.ejs");
  }
})



app.get('/editdetails',async (req, res) => {
  if(!req.oidc.isAuthenticated()){
    res.redirect("/login");
  }else{
    let data = req.oidc.user;
    let userData = await user.find({email:data.email});
    console.log(userData);
    res.render("editDetails.ejs",{userData});
  }
})

app.post("/details",async (req,res)=> {
  let {username,age,gender,height,weight,phoneno,reffered,state} = req.body;
  let email = req.oidc.user.email;
  const newUser=new user({name:username,email:email,phoneno:phoneno, age:age,gender:gender,height:height,weight:weight,refer:reffered,state:state});
  await newUser.save();
  res.redirect('/');
})

app.patch('/editdetails/:id', async (req, res) => {
  let {id} = req.params;
  id = id.toString();
  let {username,age,gender,height,weight,phoneno,reffered,state} = req.body;
  let data = await user.findByIdAndUpdate(id,{name:username,phoneno:phoneno, age:age,gender:gender,height:height,weight:weight,refer:reffered,state:state});
  console.log(data);
  res.redirect("/");
})


app.get("/admin", async (req, res) => {
  let totalUsers = await user.find();
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
// const authToken = afaf98e80299af84c01583b3e886087c;
// const client = require('twilio')(accountSid, authToken);

// client.messages
//     .create({
//         body: 'Your appointment is coming up on July 21 at 3PM',
//         from: 'whatsapp:+14155238886',
//         to: 'whatsapp:+916387488465'
//     })
//     .then(message => console.log(message.sid))
//     .done();