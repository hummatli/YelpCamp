var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds")
    

// Configures
mongoose.connect("mongodb://localhost/yelp_camp_v3" , { useMongoClient: true })
mongoose.Promise = global.Promise

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")

// Itit DB Configuration
seedDB()


//ROUTES
app.get("/", function(req, res) {
    res.render("landing")
})

app.get("/campgrounds", function(req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err)
        } else {
            res.render("index", {campgrounds: allCampgrounds})
        }
    })
})

app.get("/campgrounds/new", function(req, res) {
    res.render("new")
})

app.post("/campgrounds", function(req, res) {
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

app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err)
        } else {
            console.log("FoundCampround " + foundCampground)
            res.render("show", {campground: foundCampground})
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started")
})