const mongoose = require('mongoose');

let userschema = mongoose.Schema({
    name : String,
    phoneno: String ,
    email : String,
    gender : String,
    weight : Number,
    height :Number ,
    age: Number,
    counter:Number,
    refer: String,
    state:String,
    admin:String
});

let user = mongoose.model('user',userschema);

module.exports = user;
