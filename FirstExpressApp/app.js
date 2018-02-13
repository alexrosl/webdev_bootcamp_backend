var express = require("express");
var app = express();
var path = require("path");


app.get("/", function(req, res){
   res.send("Hi there!"); 
});

app.get("/plus", function(req, res){
    res.send(String(1+2+3));
})

app.get("/repeat/:message/:count", function(req, res){
    var message = req.params.message;
    var count = Number(req.params.count);
    res.send((message + " ").repeat(count));
})

app.get("/sound/:animal", function(req, res){
    var sound = {
        cat: "meow",
        dog: "woof",
        cow: "moo"
    }
    var animal = req.params.animal;
    var message = sound[animal] ? sound[animal] : "blah";
    res.send(animal + " said " + message);
})

app.get("*", function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
})



//Listening for requests
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started")
});