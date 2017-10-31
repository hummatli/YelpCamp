var express = require("express")
var app = express()

app.set("view engine", "ejs")


app.get("/", function(req, res) {
    res.render("landing")
})

app.get("/campgrounds", function(req, res) {
    var campgrounds = [
            {name: "Salmon Creek", image: "http://www.photosforclass.com/download/31733208"},
            {name: "Granite Hill", image: "http://www.photosforclass.com/download/14442300701"},
            {name: "Mountain Goat's Rest", image: "http://www.photosforclass.com/download/15989950903"}
        ]
    
    res.render("campgrounds", {campgrounds: campgrounds})
})

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started")
})