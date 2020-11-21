var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var express = require("express");
var passport = require("passport");
var localstrategy = require("passport-local");
var methodoverride = require("method-override");
var app = express();
var reservation = require("./models/reservation");
var user = require("./models/user");
var dishes = require("./models/dishes");
var feedback = require("./models/feedback");




mongoose.connect("mongodb://localhost:27017/hotel", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodoverride("_method"));


app.use(require("express-session")({
    secret: " this is a flash restuarent",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.currentuser = req.user;
    next();
})
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.get("/", function(req, res) {
    res.redirect("/flash");
});


app.get("/flash", function(req, res) {

    res.render("index", { currentuser: req.user });
});
app.get("/flash/menu", function(req, res) {
    dishes.find({}, function(err, menu) {
        if (err) {
            console.log(err);
        } else {


            res.render("menu", { menu: menu });
        }
    });

});
app.get("/flash/about", function(req, res) {
    res.render("about");
});

app.get("/flash/feedback", function(req, res) {
    feedback.find({}, function(err, feedback) {
        if (err) {
            console.log(err);
        } else {

            res.render("feedback", { text: feedback });
        }
    })

})

app.get("/flash/h&l", function(req, res) {
    res.render("houre");
});

app.get("/flash/addmenu", function(req, res) {
    res.render("addmenu");
});

app.get("/flash/signup", function(req, res) {
    res.render("signup");
})

app.get("/flash/login", function(req, res) {
    res.render("login");
})

app.get("/flash/addfeedback", isloggedin, function(req, res) {
    res.render("addfeedback");
});

app.post("/flash/login", passport.authenticate("local", {
    successRedirect: "/flash",
    failureRedirect: "/flash/login"
}), function(req, res) {

});

app.post("/flash/menu", function(req, res) {
    var dd = req.body.adddinner;
    var ld = req.body.addlunch;
    var sd = req.body.addspecial;
    var breakd = req.body.addbreakfast;
    var bd = req.body.addbrunch;
    dishes.create({ dinnerdish: dd, lunchdish: ld, specialdish: sd, breakfastdish: breakd, brunchdish: bd }, function(err, menu) {
        if (err) {
            console.log(err);
        } else {
            console.log(menu);
        }
    });
    res.redirect("/flash/menu");
});


app.post("/flash/feedback", function(req, res) {
    var name = req.body.name;
    var feedbacktext = req.body.feedback;
    var date = Date.now;
    feedback.create({ name: name, feedbacktext: feedbacktext }, function(err, feed) {
        if (err) {
            console.log(err);
        } else {
            console.log(feed);

        }
    });
    res.redirect("/flash/feedback");
});

app.post("/flash/signup", function(req, res) {
    user.register(new user({ username: req.body.username, email: req.body.email, phonenumber: req.body.phonenumber }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.redirect("/flash/signup");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/");
        });
    });

});

app.get("/flash/logout", function(req, res) {
    req.logOut();
    res.redirect("/");
});

app.get("/flash/reservation", isloggedin, function(req, res) {

    user.findOne({ username: req.user.username }, function(err, user) {
        if (err) {
            console.log(err);
        } else {




            res.render("reservation", { user: user });

        }
    })

});

app.get("/flash/newreservation", isloggedin, function(req, res) {
    res.render("newreservation")
})

app.post("/flash/newreservation", function(req, res) {
    var peoples = req.body.peoples;
    var timing = req.body.timing;
    var date = req.body.date;
    reservation.create({ numberofpeoples: peoples, timing: timing, date: date }, function(err, reserv) {
        if (err) {
            console.log(err);
        } else {
            console.log(req.user);
            console.log(req.user.username);
            req.user.reservation.push(reserv);
            req.user.save();
            res.redirect("/flash/reservation");
        }
    })
});

function isloggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/flash/login");
}

app.listen(8080, function() {
    console.log("we are in server");
})