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

function handleDevelopementError(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err
  });
}

function productionErrorHandler(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
     
    });
  } else {
    res.status(err.statusCode).json({
      status: "ERROR",
      message: "Something went very wrong",
      status: err.status,
    });
  }
}

module.exports = (err, req, res, next) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "developement") {
    handleDevelopementError(err, res);
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

    productionErrorHandler(copyingErrObject, res);
  }
};
