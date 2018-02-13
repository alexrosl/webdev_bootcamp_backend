var express = require("express");
var app = express();

app.use(express.static("public"))
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("home");
})

app.get("/perform/:thing", function(req, res){
    var thing = req.params.thing;
    res.render("perform", {thing: thing});
})

app.get("/posts", function(req, res){
    var posts = [
        {postTitle : "post body 1", author: "author1"},
        {postTitle : "post body 2", author: "author2"},
        {postTitle : "post body 3", author: "author3"}
    ];
    res.render("posts", {posts : posts})
})



app.get("*", function(req, res){
    res.send("any page");
})


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started")
});