var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");


router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
});

//можно добавлять не автора, а его id
router.post("/", isLoggedIn, function(req, res){
    // console.log(req.body);
    var campName = req.body.name;
    var campImage = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp = {name: campName, image: campImage, description: desc, author: author};
    
    Campground.create(newCamp, function(err, createdCampground){
        if(err){
            console.log(err)
        }else{
            res.redirect("/campgrounds")
        }
    });
})

//CREATE new campground page
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
})

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(foundCampground);
            console.log(err)
        } else {
            //console.log(foundCampground)
           res.render("campgrounds/show", {campground: foundCampground});
        }
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;