var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "campground not found")
                res.redirect("back")
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "you dont have permission")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "you need to be logged in")
        res.redirect("back")
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("/campgrounds")
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "you dont have permissions")
                    res.redirect("/campgrounds")
                }
            }
        })
    } else {
        req.flash("error", "you need to be logged in")
        res.redirect("/login")
    }
}

middlewareObj.checkRatingExists = function(req, res, next){
    Campground.findById(req.params.id).populate("ratings").exec(function(err, campground){
        if(err){
            console.log(err);
        }
        for(var i = 0; i < campground.ratings.length; i++){
            if(campground.ratings[i].author.id.equals(req.user._id)){
                req.flash("success", "You already rated this!");
                return res.redirect("/campgrounds/" + campground._id);
            }
        }
        next();
    })
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.redirectTo = req.originalUrl;
    req.flash("error", "please login first!");
    res.redirect("/login");
}

module.exports = middlewareObj;