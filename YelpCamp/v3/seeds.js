var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment     = require("./models/comment")


var data = [
    {name: "Cloud's Rest", 
    image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
    description: "blah blah blah"},
    {name: "Desert Mesa", 
    image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
    description: "blah blah blah"},
    {name: "Canyon floor", 
    image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
    description: "blah blah blah"}
    ]

function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err)
            
        }
        console.log("removed camgrounds");
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if (err){
                    console.log(err)
                } else {
                    console.log("added a camp");
                    Comment.create({text: "this place is great",
                                    author: "Homer"
                    }, function(err, comment){
                        if (err){
                            console.log(err)
                        } else {
                            // console.log(campground);
                            campground.comments.push(comment._id);
                            campground.save();
                            console.log("created new comment")
                        }
                        
                    })
                }
        });
    })
    })
    
    
    
}


module.exports = seedDB;