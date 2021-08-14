let tourModel=require('../models/tourModel')
let ApiFeatures = require('../utils/apiFeatures');
const catchAsync=require('../utils/catchAsync')
let appError = require("../utils/appError");



// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch((err) => {
//       next(err);
//     });
//   };
// };

exports.getAllTour = catchAsync(async (req, res, next) => {
  let features = new ApiFeatures(tourModel, req.query)

    .filtering()
    .sorting()
    .limiting()
    .pagination();
    console.log(features)
    let tours = await features.query  
  res.json({
    length: tours.length,
    data: tours,
  });
});

exports.createNewTour = catchAsync(async (req, res, next) => {
  await tourModel.create(req.body);
  res.status(201).json({
    status: "written",
  });
});
exports.updateTour = catchAsync(async (req, res, next) => {
  let updatedTour = await tourModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  //setting for global error incase of an bad id error.
  if (!updatedTour) {
    return next(new appError("No data with such ID", 404));
  }
  res.status(201).json({
    status: "updated",
    newUser: updatedTour,
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const deleteTour = await tourModel.findByIdAndDelete(req.params.id);
  if (!deleteTour) {
    return next(new appError("Can not delete No such ID", 404));
  }

  res.json({
    data: "deleted",
  });
});

exports.deleteAllTour = catchAsync(async (req, res, next) => {
  await tourModel.deleteMany();
  res.json({
    data: "deleted",
  });
});

exports.getSingleTour = catchAsync(async (req, res, next) => {
  let singleTour = await tourModel.findById(req.params.id);
  if (!singleTour) {
    return next(new appError("Can not find No such ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: singleTour,
  });
});

exports.aliasing = (req, res, next) => {
  req.query.limit = 3;
  req.query.sort = "price,-ratingsAverage";

  next();
};

exports.tourStat = catchAsync(async (req, res, next) => {
  let tourStat = await tourModel.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.7 } },
    },
    {
      $group: {
        _id: "$difficulty",

        averageRating: { $avg: "$ratingsAverage" },
        priceAvg: { $avg: "$price" },
        durationAvg: { $avg: "$duration" },
        ratingQuantityAvg: { $avg: "$ratingsQuantity" },
        sum: { $sum: "1" },
      },
    },
  ]);
  res.json({
    status: "statistics successed",
    data: tourStat,
  });
});

exports.busyMonth = catchAsync(async (req, res) => {
  let year = req.params.year;
  let busy = await tourModel.aggregate([
    {
      $unwind: "$startsDate",
    },
    {
      $match: {
        startsDate: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $group: {
        _id: { $month: "$startsDate" },
        numOfTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },

    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numOfTourStarts: -1 },
    },
  ]);

  res.json({
    data: busy,
  });
});
