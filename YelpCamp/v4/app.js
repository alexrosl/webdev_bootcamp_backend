var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds")
    

seedDB();    

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


var campgrounds = [
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
];

app.get("/", function(req, res){
    res.redirect("/campgrounds");
})

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
});

app.post("/campgrounds", function(req, res){
    // console.log(req.body);
    var campName = req.body.name;
    var campImage = req.body.image;
    var desc = req.body.description;
    var newCamp = {name: campName, image: campImage, description: desc};
    
    Campground.create(newCamp, function(err, campground){
        if(err){
            console.log(err)
        }else{
            res.redirect("/campgrounds")
        }
    });
})

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
})

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            //console.log(foundCampground)
           res.render("campgrounds/show", {campground: foundCampground});
        }
    })
})

//============================
// COMMENTS
//============================

app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground})
        }
    })
    
});

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err)
           res.redirect("/campgrounds")
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err)
               } else {
                   campground.comments.push(comment._id);
                   campground.save();
                   res.redirect("/campgrounds/" + campground._id)
               }
           })
       }
    });
    
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server has started');
})