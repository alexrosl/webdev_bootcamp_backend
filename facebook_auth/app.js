var express = require("express");
var app     = express();
var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");

var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var User = require("./models/user");
var configAuth = require("./config/auth");


mongoose.connect("mongodb://localhost/facebook-auth");

app.use(morgan('dev')); // logging every request
app.use(cookieParser());
app.use(bodyParser());

app.set("view engine", "ejs");

//for passport
app.use(session({secret: 'secretforfacebook'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function(user, done){
    done(null, user.id)
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user) {
        done(err, user);
    })
})

passport.use(new FacebookStrategy({
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL
},
function(token, refreshToken, profile, done){
    
    process.nextTick(function(){
        
        User.findOne({ "facebook.id" : profile.id }, function(err, user){
            
            if(err){
                return done(err);
            }
            
            if(user){
                return done(null, user);
            } else {
                var newUser = new User();
                newUser.facebook.id     = profile.id;
                newUser.facebook.token  = token;
                newUser.facebook.name   = profile.displayName;
                profile.emails ? newUser.facebook.email = profile.emails[0].value : newUser.facebook.email = "no email";
                
                newUser.save(function(err) {
                    if (err){
                        throw err;
                    }
                    return done(null, newUser);
                })
            }
        })
    })
}
));


//ROUTES=================

app.get("/", function(req, res){
    res.render("index");
})

app.get("/profile", isLoggedIn, function(req, res){
    res.render("profile", {
        user: req.user //пользователь из сессии
    })
})

//Facebook routes
app.get("/auth/facebook", passport.authenticate("facebook", {scope: "email"}));

app.get("/auth/facebook/callback",
        passport.authenticate("facebook", {
            successRedirect : "/profile",
            failureRedirect : "/"
}));

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
})


function isLoggedIn(req,res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started");
})