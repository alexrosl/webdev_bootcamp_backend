var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var moment      = require("moment");


router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
        Campground.find({name: regex}, function(err, allCampgrounds){
            if (err){
                console.log(err);
            } else {
                if(allCampgrounds.length < 1){
                    noMatch = "No campgrounds found";
                }
                res.render("campgrounds/index", {campgrounds: allCampgrounds, noMatch: noMatch});
            }
        })    
    } else {
        Campground.find({}, function(err, allCampgrounds){
            if (err){
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds, noMatch: noMatch});
            }
        })
    }
    
});

router.post("/", middleware.isLoggedIn,  function(req, res){
    // console.log(req.body);
    var campName = req.body.name;
    var campPrice = req.body.price;
    var campImage = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp = {name: campName, price: campPrice, image: campImage, description: desc, author: author};
    
    Campground.create(newCamp, function(err, createdCampground){
        if(err){
            console.log(err)
            res.redirect("back")
        }else{
            req.flash("success", "you just added campground with name " + newCamp.name);
            res.redirect("/campgrounds")
        }
    });
})

//CREATE new campground page
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
})

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").populate("ratings").exec(function(err, foundCampground){
        if(err){
            // console.log(foundCampground);
            // console.log(err)
            res.redirect("back")
        } else {
            //console.log(foundCampground)
            if(foundCampground.ratings.length > 0){
                var ratings = [];
                var length = foundCampground.ratings.length;
                foundCampground.ratings.forEach(function(rating){
                    ratings.push(rating.rating);
                });
                var rating = ratings.reduce(function(total, element){
                    return total + element;
                })
                foundCampground.rating = rating / length;
                foundCampground.save();
            }
            console.log("ratings: " + foundCampground.ratings);
            console.log("rating: " + foundCampground.rating)
            
           res.render("campgrounds/show", {campground: foundCampground});
        }
    })
})

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err)
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    })
})

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;