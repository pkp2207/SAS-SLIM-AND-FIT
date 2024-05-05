const express = require('express');
const app = express();
const bp = require('body-parser');
const user = require('./models/userschema.js');
const mongoose = require('mongoose');
const path = require('path');

const mongoDB = 'mongodb+srv://httwarriors12:akshat@cluster0.n9sknas.mongodb.net/hacktt';
const methodOverride = require("method-override");
mongoose.connect(mongoDB);

app.use(bp.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));
const { auth } = require('express-openid-connect');
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'https://warriors-xipp.onrender.com/',
  clientID: 'ouN2IFII0oE7eWZF3UgPaaaXuLe6nnK4',
  issuerBaseURL: 'https://dev-ktrnto3xhx5pfgg2.us.auth0.com'
};

let date = mongoose.model('Date', { msg: String, time: String });

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
app.use(methodOverride("_method"));
var serverdate = new Date();
var logoutdate = new Date();


// req.isAuthenticated is provided from the auth router
const { requiresAuth } = require('express-openid-connect');
app.get('/', async (req, res) => {
  let verified = req.oidc.isAuthenticated();
  if (!verified) {
    res.render("once.ejs");
  } else {
    let data = req.oidc.user;
    // console.log(data);
    let userdata = await user.find({ email: data.email });
    serverdate=data.updated_at;
    // serverdate.setHours(serverdate.getUTCHours() + 5);
    // serverdate.setMinutes(serverdate.getUTCMinutes() + 30);
    // console.log(serverdate);
    if (userdata.length == 0) {
      res.redirect("/details");
    } else {
      let userInfo = req.oidc.user;
      // console.log(userInfo);
      let photo = userInfo.picture;
      let userData = await user.find({ email: userInfo.email});
      let userCounter = userData[0].counter + 1;
      await user.findOneAndUpdate({ email: data.email }, { counter: userCounter });
      // console.log(userData);
      res.render("homepage.ejs", { userData: userData, photo: photo });
    }
  }
});

app.get('/details', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    res.redirect("/login");
  } else {
    res.render("aftersignup.ejs");
  }
})



app.get('/editdetails', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    res.redirect("/login");
  } else {
    let data = req.oidc.user;
    let userData = await user.find({ email: data.email });
    // console.log(userData);
    res.render("editDetails.ejs", { userData });
  }
})

app.post("/details", async (req, res) => {
  let { username, age, gender, height, weight, phoneno, reffered, state } = req.body;
  let data = req.oidc.user;
  let logintime = data.updated_at;
  let email = req.oidc.user.email;

  const newUser = new user({ name: username, email: email, phoneno: phoneno, age: age, gender: gender, height: height, weight: weight, refer: reffered, state: state,counter:0 ,firstlogin:logintime});
  await newUser.save();
  res.redirect('/');
})

app.patch('/editdetails/:id', async (req, res) => {
  let { id } = req.params;
  id = id.toString();
  let { username, age, gender, height, weight, phoneno, reffered, state } = req.body;
  let data = await user.findByIdAndUpdate(id, { name: username, phoneno: phoneno, age: age, gender: gender, height: height, weight: weight, refer: reffered, state: state });
  // console.log(data);
  res.redirect("/");
})


// BMI Calculation Function
function calculateBMI(weight, height) {

  height /= 100;
  return weight / (height * height);
}

app.get("/admin", async (req, res) => {
  let verified = req.oidc.isAuthenticated();
  if (!verified) {
    res.redirect('/login');
  } else {
    let data = req.oidc.user;
    let userdata = await user.find({ email: data.email });

    if (userdata.length === 1 && userdata[0].admin === "yes") {
      let totalUsers = await user.find();
      let bmiRanges = { underweight: 0, normal: 0, overweight: 0, obese: 0 };
      let ageGroups = { group1: 0, group2: 0, group3: 0 };
      let totalBMI = 0;
      let totallogins = 0;

      totalUsers.forEach((user) => {
        let bmi = calculateBMI(user.weight, user.height);
        totalBMI += bmi;
        totallogins += user.counter;

        if (bmi < 18.5) {
          bmiRanges.underweight++;
        } else if (bmi >= 18.5 && bmi < 25) {
          bmiRanges.normal++;
        } else if (bmi >= 25 && bmi < 30) {
          bmiRanges.overweight++;
        } else {
          bmiRanges.obese++;
        }

        if (user.age < 25) {
          ageGroups.group1++;
        } else if (user.age >= 25 && user.age < 50) {
          ageGroups.group2++;
        } else if (user.age >= 50) {
          ageGroups.group3++;
        }
      });

      // Calculate average BMI
      let averageBMI = totalBMI / totalUsers.length;
      // console.log({
      //   totalUsers: totalUsers,
      //   bmiRanges: bmiRanges,
      //   ageGroups: ageGroups,
      //   averageBMI: averageBMI,
      //   logins:totallogins
      // });
      res.render("index.ejs", {
        totalUsers: totalUsers,
        bmiRanges: bmiRanges,
        ageGroups: ageGroups,
        averageBMI: averageBMI,
        logins:totallogins
      });
    } else {
      res.redirect('/logout2');
    }
  }
});
app.get('/logout2',async (req,res)=>{
  if (req.oidc.isAuthenticated()) {
    let data = req.oidc.user;
    let userData = await user.find({ email: data.email });
    // console.log(userData);
    res.render("editDetails.ejs", { userData });
  } 

})

app.get('/profile', requiresAuth(), async (req, res) => {
  var datar = req.oidc.user;
  //res.send(datar.email);
  // console.log(datar.email);
  let a = await user.find({ email: datar.email });
  // console.log(a);
  res.render('index.ejs', { a: a })
});

app.delete("/admin/:id", async (req, res) => {
  let {id} = req.params;
  let data = await user.findByIdAndDelete(id);
  res.redirect("/admin");
})

app.get("/admin/edituser/:id",async (req,res)=>{
  let {id} = req.params;
  let userData = await user.findById(id);
  // console.log(userData);
  res.render("adminedit.ejs",{userData});
})

app.patch("/admin/edituser/:id", async (req, res) => {
  let {id} = req.params;
  id = id.toString();
  let {username,age,gender,height,weight,phoneno,reffered,state} = req.body;
  let data = await user.findByIdAndUpdate(id,{name:username,phoneno:phoneno, age:age,gender:gender,height:height,weight:weight,refer:reffered,state:state});
  // console.log(data);
  res.redirect("/admin");
})


app.post('/whatsapp', async (req, res) => {
  const accountSid = 'AC2432ec38ded5be3df0578d9c77918fcf';
const authToken = req.body.tok;
const client =await require('twilio')(accountSid, authToken);
  let userd = await user.find({});
  userd.forEach(async(x)=>{
   await client.messages
      .create({
          body: req.body.msg,
          from: 'whatsapp:+14155238886',
          to: 'whatsapp:+91'+x.phoneno
      })

  })
  res.redirect("/admin");
})
function getMonthFromDate(dateString) {
  const date = new Date(dateString);
  const monthNumber = date.getMonth() + 1; // Adding 1 because months are zero-indexed
  return monthNumber;
}


const dateString = 'Sun Mar 24 2024 11:18:42 GMT+0530 (India Standard Time)';


function numofuniqueUsers(userData,admintime) {
  let count = 0;
  // console.log(admintime);
  let adminyear = admintime.slice(11,15);
  // let adminmonth = getMonthFromDate(admintime);
  // let admindays = admintime.slice(8,10);
  let eachMonthData = new Array(12).fill(0)
  // console.log(eachMonthData);
  // console.log(admindays,adminyear,adminmonth);
  userData.forEach((user)=>{
    // console.log(user.firstlogin);
    let logindetail = user.firstlogin.toString();
    let year = logindetail.slice(0,4);
    let month = logindetail.slice(5,7);
    let days = logindetail.slice(8,10);
    // console.log(year,month,days);
    if(adminyear==year){
      eachMonthData[month - 1] = eachMonthData[month - 1] + 1;
    }
  });
  return eachMonthData;
}

app.post("/admin/getuniquevisitors/",async (req, res) => {
  let {admintime} = req.body;
  // console.log("timemila",admintime);
  let userData = await user.find({});
  // console.log(userData)
  let eachMonthData = numofuniqueUsers(userData,admintime);
  console.log(eachMonthData);
  const months = [
    { month: 'January', users: eachMonthData[0] },
    { month: 'February', users: eachMonthData[1] },
    { month: 'March', users: eachMonthData[2] },
    { month: 'April', users: eachMonthData[3] },
    { month: 'May', users: eachMonthData[4] },
    { month: 'June', users: eachMonthData[5] },
    { month: 'July', users: eachMonthData[6] },
    { month: 'August', users: eachMonthData[7] },
    { month: 'September', users: eachMonthData[8] },
    { month: 'October', users: eachMonthData[9] },
    { month: 'November', users: eachMonthData[10] },
    { month: 'December', users: eachMonthData[11] }
  ];
  console.log(months);
  res.render("newusers.ejs",{months});
})

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
