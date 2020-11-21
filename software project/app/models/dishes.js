var mongoose = require("mongoose");
var dishschema = new mongoose.Schema({
    dinnerdish: String,
    lunchdish: String,
    brunchdish: String,
    breakfastdish: String,
    specialdish: String
});

module.exports = mongoose.model("dishes", dishschema);