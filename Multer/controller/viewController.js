// const tourModel=require('../models/tourModel')
// const catchAsync=require('../utils/catchAsync')
// const appError=require('../utils/appError')

exports.allTours = (req, res, next) => {
  res.status(200).render("base", { title: "Home Page" });
};
/*Let us bring tour data from data base and then we will send those data to overview page. */
const tourModel = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
exports.overview = catchAsync(async (req, res, next) => {
  const tours = await tourModel.find();
  console.log("hello from overview");
  console.log(tours);
  res.status(200).render("overview", { title: "All Tours", tours: tours });
});

const appError = require("../utils/appError");

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await tourModel.findOne({ slug: req.params.slug }).populate({
    path: "review",
    fields: "revew user rating",
  });
  /* 8. Let us make check if the perticular route for front end exists or not. If not then
we will make appError. */
  if (!tour) res.send(new appError("No tour with such name", 404));
  res.status(200).render("tour", { title: "The Forest Hiker", tour });
});

exports.logIn = catchAsync((req, res, next) => {
  res.status(200).render("login", {
    title: "Log in",
  });
});

//9 cont...)
exports.getAccount=(req,res,next)=>{
  //Here we dont have to pass the user because in protect middleware we have already passed it.
  res.status(200).render('account.pug',{
    title:'your account'
  })
}

/*9 a) Now let us implement '/me' link in the fron end ie. in header file. Go to header.pug file*/


/*Let us now implement data */
