const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");

//pug or view routes
const viewRouter = require("./routes/viewRoute");
const tourRoutes = require("./routes/tourRoute");
const userRoutes = require("./routes/userRoute");
const appError = require("./utils/appError");
const globalErrorHandler = require("./controller/globalErrorController/globalErrorHandler");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dataSanitizer = require("express-mongo-sanitize");
const xssCleaner = require("xss-clean");

app.use(helmet());
app.use(express.json({ limit: "10kb" })); // limit data coming from body to prevent from attackers heavy code

app.use(dataSanitizer());
app.use(xssCleaner());

app.use(morgan("tiny"));

const limitMiddleware = rateLimit({
  max: 3,
  windowMs: 15 * 1000,
  message: "request limit reached. Please try after one hour",
});

/* Templates
            First set the template engine you want to use. Then specify the folder where you have
            created pug templates and the serve those static pug file. Finally we will define route
            to render those templates in the browser.
  */

//1 Set view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

/*All the files inside the public folder can be easily used from pug file.
e.g style.css file inside the public folder can be easily used like 
link(rel="stylesheet", href="style.css")
*/
app.use(express.static(path.join(__dirname, "public")));

//Pug route
// app.get('/',(req,res,next)=>{
//   res.status(200).render('base',{pugVariable1:'Karan'})
// })

// Let us make separate file for template routing
// app.get('/',(req,res,next)=>{
//   res.status(200).render('base',{
//     title:'Home Page',
//     name:'kunal'
//   })
// })
// app.get('/overview',(req,res,next)=>{
//   res.status(200).render('overview',{ title:'All Tours'})
// })
// app.get('/tour',(req,res,next)=>{
//   res.status(200).render('tour',{ title:'The Forest Hiker'})
// })

app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://cdnjs.cloudflare.com"
  );
  next()
});
// vayen vai K garne hola?
app.use("/", viewRouter);

/*1 Now let us make overview page.  */

app.use("/tour", limitMiddleware);
app.use("/user", userRoutes);
app.use("/tour", tourRoutes);

app.all("*", (req, res, next) => {
  next(new appError("invalid url", 400));
});

app.use(globalErrorHandler);

module.exports = app;
