var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment")

var data = [
        {
            name: "Cloud's Rest",
            image: "https://farm4.staticflickr.com/3805/9667057875_90f0a0d00a.jpg",
            description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
        },
        {
            name: "Desert Mesa",
            image: "https://farm2.staticflickr.com/1084/535341894_7431fa20f8.jpg",
            description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
        },
        {
            name: "Canyon Floor",
            image: "https://farm5.staticflickr.com/4514/36822417253_a2a217e2c8.jpg",
            description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
        }
    ]

function seedDB() {
    //Remove all comments
    Comment.remove({}, function(err) {
        if(err) {
            console.log(err)
        } else {
            console.log("All comments removed")
        }
    })
    
    //Remove all campgrounds
    Campground.remove({}, function(err) {
        if(err) {
            console.log(err)
        } else {
            console.log("Removed campgrounds")
            
            //Add a few campgrounds
            data.forEach(function(seed) {
                Campground.create(seed, function(err, campground) {
                    if(err) {
                        console.log(err)
                    } else {
                        console.log("added campground")
                        
                        //Create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment) {
                                if(err) {
                                    console.log(err)
                                } else {
                                    campground.comments.push(comment)
                                    campground.save()
                                    console.log("Created new comment")
                                }
                            })
                    }
                })
            })
        }
    })
}

module.exports = seedDB

