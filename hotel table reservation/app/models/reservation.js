var mongoose = require("mongoose");
var reservationschema = new mongoose.Schema({
    numberofpeoples: Number,
    date: Date,
    timing: String,
    who: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        username: String

    }
});
module.exports = mongoose.model("reservations", reservationschema);