const userRoute = require("express").Router();
const userController = require("../controller/userController");
const authController = require("../controller/authController");

/*Authentication :
For this we will use seperate routes like sign up which will then go to authController ;

REST architecture does not work 100% for all the routes.
*/
// userRoute.route('/signup').post(authController.signup)
userRoute.post("/signup", authController.signup);
userRoute.post("/signin", authController.signin);

//password reset functionality
userRoute.post("/forgotPassword", authController.forgotPassword);
userRoute.patch("/resetPassword/:token", authController.resetPassword);

//password update functionality
userRoute.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

//update user information functionality
userRoute.patch("/updateMe", authController.protect, userController.updateMe);

//deactive user account
userRoute.delete("/deleteMe", authController.protect, userController.deleteMe);


//protecting routes
userRoute
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createNewUser);
userRoute
  .route("/:id")
  .get(userController.getSingleUser)
  // .patch(userController.updateUser)
  // .delete(userController.deleteUser);

module.exports = userRoute;
