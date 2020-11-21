var mongoose = require("mongoose");
var passportlocalmongoose = require("passport-local-mongoose");
var userschema = new mongoose.Schema({
    username: String,
    email: String,
    phonenumber: String,
    password: String,
    reservation: [{
        numberofpeoples: Number,
        date: Date,
        timing: String,
    }]
});
userschema.plugin(passportlocalmongoose);

module.exports = mongoose.model("users", userschema);