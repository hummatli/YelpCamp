var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")
var middleware = require("../middleware")


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

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new")
})

router.post("/", middleware.isLoggedIn, function(req, res) {
    //get data from form and add to campgrounds array
    var name = req.body.name
    var price = req.body.price
    var image = req.body.image
    var desc = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author}
    
    //Create new campground and insert to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err)
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated)
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

//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground})
    })
})

//Update campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
})

module.exports = router
