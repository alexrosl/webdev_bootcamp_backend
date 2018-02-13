var express = require("express");
var multer  = require("multer");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var upload = multer({storage: storage}).any("image", 5);

router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
});

router.post("/", middleware.isLoggedIn,  function(req, res){
    upload(req, res, function(err){
        if(err) {
            console.log(err);
            return res.send("error uploading file");
        }
        var campName = req.body.name;
        var campPrice = req.body.price;
        
        var images = [];
        if(typeof req.files !== "undefined"){
            for(var i = 0; i < req.files.length; i++){
                images.push("/uploads/" + req.files[i].filename);
            }
        } else {
            images.push("/uploads/no-image.png")
        }
        
        var desc = req.body.description;
        var author = {
            id: req.user._id,
            username: req.user.username
        }
        var newCamp = {name: campName, price: campPrice, images: images, description: desc, author: author};
        
        Campground.create(newCamp, function(err, createdCampground){
            if(err){
                console.log(err)
                res.redirect("back")
            }else{
                req.flash("success", "you just added campground with name " + newCamp.name);
                res.redirect("/campgrounds")
            }
        });
    });
})

//CREATE new campground page
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
})

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(foundCampground);
            console.log(err)
            res.redirect("back")
        } else {
            //console.log(foundCampground)
            // console.log(foundCampground);
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
    upload(req, res, function(err){
      if(err){
          return res.send("error uploading file")
      }
    //   console.log(req);
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
            if(err){
                console.log(err);
                res.redirect("/campgrounds");
            } else {
                // console.log("===== removals ====")
                // console.log(req.body.removals);
                //Добавляем в массив вновь загруженные
                if(req.files.length){
                    for(var i = 0; i< req.files.length; i++){
                        updatedCampground.images.push("/uploads/"+req.files[i].filename)
                    }
                    updatedCampground.save();
                }
                //Удаляем помеченные на удаление изображения
                if(req.body.removals && req.body.removals.length){
                    for(var i = 0; i < req.body.removals.length; i++){
                        var index =  updatedCampground.images.indexOf(req.body.removals[i]);
                        updatedCampground.images.splice(index, 1);
                    }
                    updatedCampground.save();
                }
                //если ранее было пустое изображение, то при добавлении нового удаляем его
                if(updatedCampground.images.length > 1 && updatedCampground.images.indexOf("/uploads/no-image.png") !== -1){
                    updatedCampground.images.splice("/uploads/no-image.png",1);
                    updatedCampground.save();
                };
                //если были удалены все изображения
                if(updatedCampground.images.length === 0) {
                    updatedCampground.images.push("/uploads/no-image.png");
                    updatedCampground.save();
                }
                res.redirect("/campgrounds/" + req.params.id);
            }
      });
    })
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


module.exports = router;