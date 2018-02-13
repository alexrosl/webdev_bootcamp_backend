var express = require("express");
var app = express();
var request = require("request");
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("search.ejs");
})

app.get("/results", function(req, res){
    var longitude = req.query.longitude;
    var latitude = req.query.latitude;
    var url = "https://geocode-maps.yandex.ru/1.x/?format=json&geocode="+longitude +","+latitude
    console.log(url);
    request(url, function(error, response, body){
        if (!error && response.statusCode == 200){
            var data = JSON.parse(body);
            //console.log(body);
            //console.log(data);
            console.log(data["response"]["GeoObjectCollection"]["featureMember"]);
            res.render("results", {data: data})
        }
    })
    
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started")
});