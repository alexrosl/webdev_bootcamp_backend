var expressSanitizer = require("express-sanitizer"), 
bodyParser = require("body-parser"),
methodOverride = require("method-override"),
mongoose = require("mongoose"),
express = require("express"),
app = express();

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs")
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"))

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})

var Blog = mongoose.model("Blog", blogSchema);


//Routes
app.get("/", function(req, res){
    res.redirect("/blogs")
})

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("error")
        } else{
            res.render("index", {blogs: blogs});
        }
    })
});

app.post("/blogs", function(req, res){
    console.log(req.body.blog);
    Blog.create(req.body.blog, function(err, blog){
        if (err){
            console.log(err);
        } else {
            res.redirect("/blogs")
        }
    })
})

app.get("/blogs/new", function(req, res){
    res.render("new");
});


app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            res.render("show", {blog: foundBlog})
        }
    })
})

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err)
        } else {
            res.render("edit", {blog: foundBlog})
        }
    })
})

app.put("/blogs/:id", function(req, res){
    // console.log(req.body.blog.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // console.log(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, uptatedBlog){
        if (err){
            console.log(err)
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs")
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is up")
})