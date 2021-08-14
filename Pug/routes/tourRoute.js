const express = require("express");

const tourRouter = express.Router();
const tourController = require("../controller/tourController");
const authController = require("../controller/authController");

tourRouter
  .route("/besttours")
  .get(tourController.aliasing, tourController.getAllTour);

tourRouter.route("/tour-stat").get(tourController.tourStat);
tourRouter.route("/busy-month/:year").get(tourController.busyMonth);
tourRouter
  .route("/")
  .get(authController.protect, tourController.getAllTour)
  .post(tourController.createNewTour)
  .delete(tourController.deleteAllTour);

tourRouter
  .route("/:id")
  .get(tourController.getSingleTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "ceo"),
    tourController.deleteTour
  ); //authorize to delete

module.exports = tourRouter;
