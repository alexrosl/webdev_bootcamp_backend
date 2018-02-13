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

router.post("/", function(req, res){
    // console.log(req.body);
    var campName = req.body.name;
    var campImage = req.body.image;
    var desc = req.body.description;
    var newCamp = {name: campName, image: campImage, description: desc};
    
    Campground.create(newCamp, function(err, createdCampground){
        if(err){
            console.log(err)
        }else{
            res.redirect("/campgrounds")
        }
    });
})

//CREATE new campground page
router.get("/new", function(req, res){
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

module.exports = router;