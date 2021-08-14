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

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await tourModel.findOne({ slug: req.params.slug }).populate({
    path: "review",
    fields: "revew user rating",
  });
  res.status(200).render("tour", { title: "The Forest Hiker",
tour });
});

exports.logIn=catchAsync((req,res,next)=>{
  res.status(200).render('login',{
    title:'Log in'
  })
})