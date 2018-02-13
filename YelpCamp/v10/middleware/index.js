var Campground  = require("../models/campground");
var Comment     = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("/campgrounds")
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("/campgrounds")
                }
            }
        })
    } else {
        res.redirect("/login")
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
                    res.redirect("/campgrounds")
                }
            }
        })
    } else {
        res.redirect("/login")
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = middlewareObj;