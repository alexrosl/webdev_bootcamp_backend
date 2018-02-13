var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);


// Campground.create({
//     name: "Salmon Creek",
//     image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//     description: "description for salmon greek campground"
// }, function(err, campground){
//     if(err){
//         console.log(err)
//     }else{
//         console.log(campground)
//     }
// });

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
    res.render("landing");
})

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
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
    res.render("new");
})

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
           res.render("show", {campground: foundCampground});
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server has started');
})