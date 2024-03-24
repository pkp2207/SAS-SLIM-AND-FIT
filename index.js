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

app.use(bp.urlencoded({ extended: true }));
app.use(express.static(__dirname));
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
let date = mongoose.model('Date', { msg: String, time: String });
let nd = new date({ msg: "dhatt teri maa ki chu", time: '2024-03-24T01:59:02.208Z' })
// nd.save();

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
app.use(methodOverride("_method"));
var serverdate = new Date();



// req.isAuthenticated is provided from the auth router
const { requiresAuth } = require('express-openid-connect');
app.get('/', async (req, res) => {
  let verified = req.oidc.isAuthenticated();
  if (!verified) {
    res.render("once.ejs");
  } else {
    let data = req.oidc.user;
    let userdata = await user.find({ email: data.email });
    let usercounter = await userdata[0].counter + 1;
    console.log(usercounter);
    await user.findOneAndUpdate({ email: data.email }, { counter: usercounter })

    // console.log(userdata);
    if (userdata.length == 0) {
      res.redirect("/details");
    } else {
      let userInfo = req.oidc.user;
      // console.log(userInfo);
      let photo = userInfo.picture;
      let userData = await user.find({ email: userInfo.email });
      console.log(userData);
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
    console.log(userData);
    res.render("editDetails.ejs", { userData });
  }
})

app.post("/details", async (req, res) => {
  let { username, age, gender, height, weight, phoneno, reffered, state } = req.body;
  let email = req.oidc.user.email;
  const newUser = new user({ name: username, email: email, phoneno: phoneno, age: age, gender: gender, height: height, weight: weight, refer: reffered, state: state,counter:0 });
  await newUser.save();
  res.redirect('/');
})

app.patch('/editdetails/:id', async (req, res) => {
  let { id } = req.params;
  id = id.toString();
  let { username, age, gender, height, weight, phoneno, reffered, state } = req.body;
  let data = await user.findByIdAndUpdate(id, { name: username, phoneno: phoneno, age: age, gender: gender, height: height, weight: weight, refer: reffered, state: state });
  console.log(data);
  res.redirect("/");
})


// BMI Calculation Function
function calculateBMI(weight, height) {
  // Convert height to meters
  height /= 100;
  // Calculate BMI
  return weight / (height * height);
}

// Admin Route to Calculate BMI Range, Average BMI, and Age Groups
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

      // Calculate BMI and categorize users
      totalUsers.forEach((user) => {
        let bmi = calculateBMI(user.weight, user.height);
        totalBMI += bmi;
        totallogins += user.counter;
        // Categorize users based on BMI
        if (bmi < 18.5) {
          bmiRanges.underweight++;
        } else if (bmi >= 18.5 && bmi < 25) {
          bmiRanges.normal++;
        } else if (bmi >= 25 && bmi < 30) {
          bmiRanges.overweight++;
        } else {
          bmiRanges.obese++;
        }

        // Categorize users based on age groups provided by you
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
      console.log({
        totalUsers: totalUsers,
        bmiRanges: bmiRanges,
        ageGroups: ageGroups,
        averageBMI: averageBMI,
        logins:totallogins
      });
      res.render("index.ejs", {
        totalUsers: totalUsers,
        bmiRanges: bmiRanges,
        ageGroups: ageGroups,
        averageBMI: averageBMI,
        logins:totallogins

      });
    } else {
      res.redirect('/logout');
    }
  }
});


app.get('/profile', requiresAuth(), async (req, res) => {
  var datar = req.oidc.user;
  //res.send(datar.email);
  console.log(datar.email);
  let a = await user.find({ email: datar.email });
  console.log(a);
  res.render('index.ejs', { a: a })
});

app.listen(3000, () => {
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