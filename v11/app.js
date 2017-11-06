var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds")
    
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index")

// Configures
mongoose.connect("mongodb://localhost/yelp_camp_v10" , { useMongoClient: true }, function(err) {
    if(err) {
        console.log(err)
    } else {
        console.log("CONNECTED TO DB")
    }
} )
mongoose.Promise = global.Promise

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))

// Itit DB Configuration
//seedDB() //seed the db

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

app.use("/", indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started")
})