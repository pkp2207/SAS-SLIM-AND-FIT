const mongoose = require('mongoose');

let userschema = mongoose.Schema({
    name : String,
    phno: String ,
    email : String,
    weight : Number,
    height :Number ,
    Age: Number,
    counter:Number,
    refer: String,
    country:String
});

let user = mongoose.model('user',userschema);

module.exports = user;
