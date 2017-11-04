var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds")
    

// Configures
mongoose.connect("mongodb://localhost/yelp_camp_v6" , { useMongoClient: true })
mongoose.Promise = global.Promise

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))

// Itit DB Configuration
seedDB()

//Passport Configuration
app.use(require("express-session")({
    secret: "Once again Rusty is cutest dog",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//This middleware will be calle in every route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user
    next()
})

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
            res.render("campgrounds/index", {campgrounds: allCampgrounds})
        }
    })
})

app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new")
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
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
})

//=====================
//COMMENTS ROUTES
//=====================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground})
        }
    })
})

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err)
                } else {
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})

//============
//AUTH ROUTES
//===========

//show register form
app.get("/register", function(req, res) {
    res.render("register")
})

//will handle sign up logic 
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err)
            return res.render("register")
        } 
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds")
        })
    })
})

//show login form
app.get("/login", function(req, res) {
    res.render("login")
})

//handling login logic
app.post(
    "/login", 
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), 
    function(req, res) {
    
})

//logout route
app.get("/logout", function(req, res) {
    req.logout()
    res.redirect("/campgrounds")
})

//middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started")
})