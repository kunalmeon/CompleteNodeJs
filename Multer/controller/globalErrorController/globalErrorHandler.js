const appError = require("../../utils/appError");
//mongoose error hanlders
function convertingCastError(errorObject) {
  let message = `Invalid ${errorObject.path}: at ${errorObject.value}`;
  return new appError(message, 400);
}

function convertingDuplicateNameError(errorObject) {
  const message = `duplicate key ${errorObject.keyValue.name}`;
  return new appError(message, 400);
}

function convertingValidationError(errorObject) {
  const message = Object.values(errorObject.errors)
    .map((el) => el.message)
    .join(" ");
  return new appError(message, 400);
}

//jwt error handlers
function handleInvalidTokenError() {
  return new appError("invalid token! Please login again", 401);
}

function handleTokenExpiredError() {
  return new appError("your token expired! Please login again", 401);
}

function handleDevelopementError(err, req, res) {
  //For api
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      err,
    });
  }
  //for front end(rendered page)
  else {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message,
    });
  }
}
/*8 a) Just like for developement mode we can apply the logic in production mode also */
function productionErrorHandler(err, req, res) {
  //For api
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      return res.status(500).json({
        status: "ERROR",
        message: "Something went very wrong",
        status: err.status,
      });
    }
  }
  //For rendered page
  else {
    if (err.isOperational) {
      return res.status(err.statusCode).render("error", {
        title: "production renderd error",
        msg: err.message,
      });
    } else {
      return res.status(500).json({
        status: "ERROR",
        message: "Please try again later.",
        status: err.status,
      });
    }
  }
}

/* 9. Now we are going to build user page where user can update his/her informations like password
profile pictures and so on. Let us make template called accout.pug first. Then we will make a route
in viewRouter in order to access account.pug template file. Go to viewRouter file. */

module.exports = (err, req, res, next) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "developement") {
    handleDevelopementError(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    //somet time we also need to copy message field and name field explicitly like below because they might not be copied
    let copyingErrObject = { ...err, name: err.name, message: err.message };
    console.log(copyingErrObject);
    //mongoose error
    if (copyingErrObject.name === "CastError") {
      copyingErrObject = convertingCastError(copyingErrObject);
    }

    if (copyingErrObject.code === 11000) {
      copyingErrObject = convertingDuplicateNameError(copyingErrObject);
    }

    if (copyingErrObject.name === "ValidationError") {
      copyingErrObject = convertingValidationError(copyingErrObject);
    }

    //jwt errors
    if (copyingErrObject.name === "JsonWebTokenError") {
      copyingErrObject = handleInvalidTokenError();
    }
    if (copyingErrObject.name === "TokenExpiredError") {
      copyingErrObject = handleTokenExpiredError();
    }

    productionErrorHandler(copyingErrObject, req, res);
  }
};
