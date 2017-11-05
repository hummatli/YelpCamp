var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")


router.get("/", function(req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds})
        }
    })
})

router.get("/new", function(req, res) {
    res.render("campgrounds/new")
})

router.post("/", function(req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description
    var newCampground = {name: name, image: image, description: desc}
    
    //Create new campground and insert to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err)
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds")  
        }
    })
})

router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err)
        } else {
            console.log("FoundCampround " + foundCampground)
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
})

module.exports = router
