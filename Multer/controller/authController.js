const appError = require("../utils/appError");

const UserModel = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

const bycrpty = require("bcrypt");
const crypto = require("crypto");
const { promisify } = require("util");

const sendEmail = require("../utils/email");

const tokenMaker = function (id) {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const cookieOption = {
    experis: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_AT * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOption.secure = true;
  const token = tokenMaker(user._id);

  res.cookie("jwt", token, cookieOption);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await UserModel.create(req.body);

  createAndSendToken(newUser, 201, res);
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError("enter email and password"));
  }

  const loginUser = await UserModel.findOne({ email }).select("+password");

  if (!loginUser || !loginUser.passwordCompare(password, loginUser.password)) {
    return next(new appError("invalid email or password", 401));
  }

  createAndSendToken(loginUser, 200, res);
});

/*7) Logout functionality:- There is no way of deleting cookie from the browser since it is 
highly secured using httpOnly:true. So the logic will be we will implement a route for log out function
in such a way that it will send dummy cookie. */
exports.logout = (req, res) => {
  res.cookie("jwt", "dummyCookie", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};
//7a) Now let us implement it in userRoute so that we can use it in front end

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  /* Front end portion . Let us implement another functionality where we will check if token is also
avialabe in the browser i.e in the cookie */
  //look for the token in the cookie
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new appError("not logged in", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  console.log(decoded);
  const userStillExists = await UserModel.findById(decoded.id);

  if (!userStillExists) {
    return next(new appError("user no longer exists", 401));
  }

  if (userStillExists.changedPasswordAfter(decoded.iat)) {
    return next(new appError("password was changed. Please login agian", 401));
  }
  req.user = userStillExists;
  // 9 cont...)
  res.locals.user=userStillExists;
  next();
});

/* 
Front End logout functionality. Once the user is logged the following middleware will work for 
rendered(once logged in) pages.
Note for the rendered pages the token is always in the cookie not in the authorization because we are
dealing with front end where token is always sent using cookie not the authorization.
*/
// exports.isLoggedIn = catchAsync(async (req, res, next) => {
//   //if token is present in the cookie or not
//    if (req.cookies.jwt) {
//     const decoded = await promisify(jwt.verify)(
//       req.cookies.jwt,
//       process.env.SECRET_KEY
//     );
//     const userStillExists = await UserModel.findById(decoded.id);
//     if (!userStillExists) {
//       //If no user logged in then we dont need anything to do since its upto user to login or not
//       //So move to next middleware.
//       return next();
//     }

//     if (userStillExists.changedPasswordAfter(decoded.iat)) {
//      //same as above.
//       return next();
//     }
//     /*Here comes the logic of rendering singout or user profile functionality. We will pass the
//     information about the the user to the template so that all the temlate can have access to it.
//     It is similar to  .render("tour", { title: "The Forest Hiker",tour }); but style is
//     different, all we have to do is pass data inisie the res.local.data=value
//     */
//     //making user accessible to all user
//     res.locals.user=userStillExists

//     /*Once the isLogged in middleware is ready, we can this middleware in viewRoutes in order to work
//     it for all the routes so that we can display user navigation like logout or user profile
//     in all pages once the user has logged in. This is quite nice */

//    return next();
//   }
//   //incase of no login user we still have to continue our code execution
//   next()
// });

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.SECRET_KEY
      );
      const userStillExists = await UserModel.findById(decoded.id);
      if (!userStillExists) {
        return next();
      }

      if (userStillExists.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = userStillExists;

      return next();
    } catch (error) {
      /*There will be certain error because the jwt is dummy so trick is move to next middleware
      even if the error */
      return next()
    }
  }

  next();
};

exports.restrictTo = (...roles) => {
  console.log(roles);

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new appError("Unauthorized", 403));
    }

    next();
  };
};

exports.restrictTo = (...roles) => {
  console.log(roles);

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new appError("Unauthorized", 403));
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const resetUser = await UserModel.findOne({ email: req.body.email });

  if (!resetUser) {
    return next(new appError("no user with that email", 404));
  }

  const resetToken = resetUser.createPasswordResetToken();
  await resetUser.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/user/resetPassword/${resetToken}`;

  const message = `go to ${resetUrl} in order to reset your password `;

  try {
    await sendEmail({
      email: resetUser.email,
      message,
      subject: "Reset Password",
    });
  } catch (error) {
    resetUser.passwordResetToken = undefined;
    resetToken.passwordResetExpiresAt = undefined;
    await resetUser.save({ validateBeforeSave: false });
    return next(
      new appError("something went wrong please try again later", 500)
    );
  }
  res.status("200").json({
    status: "sent",
    message: "check your email",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedResetToken = await crypto
    .Hash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log(hashedResetToken);
  let resetUser = await UserModel.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetExpiresAt: { $gte: Date.now() },
  });

  if (!resetUser) {
    return next(new appError("invalid user or token expired", 400));
  }

  resetUser.password = req.body.password;
  resetUser.passwordConfirm = req.body.passwordConfirm;

  resetUser.passwordResetToken = undefined;
  resetUser.passwordResetExpiresAt = undefined;

  await resetUser.save();

  createAndSendToken(resetUser, 201, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const updateUser = await UserModel.findById(req.user.id).select("+password");
  console.log(updateUser);

  if (
    !(await updateUser.passwordCompare(
      req.body.currentPassword,
      updateUser.password
    ))
  ) {
    return next(new appError("invalid password", 401));
  }

  updateUser.password = req.body.newPassword;
  updateUser.passwordConfirm = req.body.confirmNewPassword;

  await updateUser.save();

  createAndSendToken(updateUser, 200, res);
});
