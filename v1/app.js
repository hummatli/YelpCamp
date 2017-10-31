var express = require("express")
var app = express()
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")

var campgrounds = [
        {name: "Salmon Creek", image: "http://www.photosforclass.com/download/31733208"},
        {name: "Granite Hill", image: "http://www.photosforclass.com/download/14442300701"},
        {name: "Mountain Goat's Rest", image: "http://www.photosforclass.com/download/15989950903"}
    ]

app.get("/", function(req, res) {
    res.render("landing")
})

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds})
})

app.get("/campgrounds/new", function(req, res) {
    res.render("new")
})

app.post("/campgrounds", function(req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name
    var image = req.body.image
    var newCampground = {name: name, image: image}
    campgrounds.push(newCampground)
    
    //redirect back to campgrounds page
    res.redirect("/campgrounds")
})

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started")
})