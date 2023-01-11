if(process.env.NODE_ENV !== 'production'){
  require("dotenv").config();
}

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");
const PORT = process.env.PORT || 7500;
const PostRoute = require("./routes/campground");
const ReviewRoutes = require("./routes/reviews");
const EjsMate = require("ejs-mate");
const AppError = require("./err");
const ExpressSession = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User");
const AuthRoute = require("./routes/Auth");
const logger = require("./controllers/logger");
const clear = require('clear')
const HomeRoute = require('./routes/Home')
const mongoSanitize = require('express-mongo-sanitize')
const review = require("./controllers/reviews");
const ReviewAuthor = require("./controllers/reviewAuthor");
const helmet = require("helmet");
const MongoStore = require('connect-mongo')


mongoose
  .connect(process.env.dburl)
  .then(function () {
    console.log("Connected");
  })
  .catch(function () {
    console.log("Failed to connect");
  });


app.use(express.static(path.join(__dirname, "/assets")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser("This is my Secret"));
app.use(methodOverride("_method"));

app.use(
  ExpressSession({
    secret: "good secret",
    resave: false,
    saveUninitialized: true,
    name:'Holiday Planner',
    store:MongoStore.create(
      {
        mongoUrl:'mongodb://localhost:27017/Project',
      }
      ),
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize({
  replaceWith:'_'
}))
passport.use(new LocalStrategy(User.authenticate()));
//store user in session serialize
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", EjsMate);
app.use(flash());
app.use(helmet())


const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://docs.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://ka-f.fontawesome.com/releases/v5.15.4/css",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  // "https://a.tiles.mapbox.com/",
  // "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
  "https://docs.mapbox.com/",
];
const fontSrcUrls = [
  // "https://kit.fontawesome.com/",
  // "https://kit-free.fontawesome.com/",
  // "https://ka-f.fontawesome.com/rel",
  // "https://ka-f.fontawesome.com/releases/v5.15.4/css",
];

app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: ["'self'", ...scriptSrcUrls, ...connectSrcUrls],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'" ,...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dsm0zoohd/",
              "https://images.unsplash.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);


app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  console.log(req.query);
  next();
});



app.use('/', HomeRoute)
app.use("/user", AuthRoute);
app.use("/post", PostRoute);
app.use("/camp/:id/review", ReviewRoutes);


clear()

app.delete(
  "/delete/:camp_id/review/:id",
  logger,
  ReviewAuthor,
  review.reviewDelete
);


app.use(function (req, res, next) {
  next(new AppError("Page not found", 404));
});

app.use(function (err, req, res, next) {
  const { message, status = 404 } = err;
  res.status(status).render("err", { message, status, err });
});

app.listen(PORT, function () {
  console.log("Server is up");
});
