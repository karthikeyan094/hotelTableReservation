var mongoose = require("mongoose");
var feedbackschema = new mongoose.Schema({
    name: String,
    feedbacktext: String,
    time: { type: Date, default: Date.now }
});







module.exports = mongoose.model("feedback", feedbackschema);