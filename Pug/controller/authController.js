/*How JWT works?
                Assuming user is registered when user tries to login the server sends the JWT to
                the client. This JWT contains three parts header,payload and the signature.
Signature is made of up header payload and the special secret key.


So once the client gets the token it tries to access the protected resources. In order to allow 
the server makes the test signature from the payload(data like username or password ) of the user
and compares it with the original signature that was sent by server at the time of token creation.

This cross checking makes the server sure that the payload was not changed and the user is valid one.

Summary:Without the secret key no one can manipulate the signature.
                  

*/
const appError = require("../utils/appError");

const UserModel = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
//bycrpty to hashold password so that we can confirm that user really is valid on
const bycrpty = require("bcrypt");
const crypto = require("crypto");
const { promisify } = require("util");
//email module
const sendEmail = require("../utils/email");

const tokenMaker = function (id) {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

//refactoring of creating and sending token

const createAndSendToken = (user, statusCode, res) => {
  // const token = tokenMaker(user._id);
  // res.status(statusCode).json({
  //   status: "success",
  //   token,
  // });

  //using cookie
  /*we can pass multiple parameter inside the cookie like */
  const cookieOption = {
    experis: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_AT * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  //conditon to add secure field
  if (process.env.NODE_ENV === "production") cookieOption.secure = true;
  const token = tokenMaker(user._id);
  // res.cookie('jwt',token,{
  //   expires:new Date(Date.now()+process.env.COOKIE_EXPIRES_AT*24*60*60*1000),
  //   httpOnly:true,
  //  /*secure : true only works in production mode with secured connection like https. so to test it now in developement
  //  mode we do not need this property. so all we can do is refactor this object in such a way that if we are
  //  in production mode then add property secure with value true */
  //   secure:true
  // })

  //refactored cookie
  res.cookie("jwt", token, cookieOption);
  //let us hide the password at the time of cookie is sent
  user.password = undefined;
  //as usual send response to user

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

//controller for sign up.
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await UserModel.create(req.body);
  /* here we will make token for the signed up user and send it to them. We do not need to verify the singnature 
  for the signed up case. Verifacation makes sense when someone tries to login as it was registered earlier. */

  /*Making of Token:
                Install jasonwebtoken package and then we have .sign() method to make token. 
                jwt.sign(payload, secretOrPrivateKey, [options, callback]).

                Once the token is ready we can send it to the user. 
                NOTE:the secret key is stored in the .config file and it should be at least of 32 characters.
*/
  //assuming user was created now install json web token and create token like below
  // const token=jwt.sign({ id:newUser._id }, process.env.SECRET_KEY, {
  //   expiresIn: process.env.EXPIRES_IN,
  // })
  // const token = tokenMaker(newUser._id);

  // res.status(201).json({
  //   data: {
  //     user: newUser,
  //     token,
  //   },
  // });

  createAndSendToken(newUser, 201, res);
});

//SIGN IN
/* Just like sign up now we will make sign in funtionality. For this we have small issue and that is
we have to compare the password since we cant not decrypt the password of data base into plane one.
For this we will make instance of method inside the schema since data is coming from schema. This
function is availabe to all the documents we made from the model. This is why it is called 
instance method. 

All the steps are shown below.
*/

exports.signin = catchAsync(async (req, res, next) => {
  /* Fist we will check if login information like email or password was entered or not */
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError("enter email and password"));
  }

  /*Second step is to find user by that entered email and then compare the password associated with it so
  that we can verify the singnature if the paylod was not mutated. One more thing is we do not have to show password
  while someone requests for all the users inside of database. For that schema provides "select" property which
  takes boolean false to hide. So we can use it inside the password field of schema. But when we compare password
  entered with that of inside the database we have to bring it out again using .select(+ password) here + sign means
  true which means show .  */
  const loginUser = await UserModel.findOne({ email }).select("+password");

  /*Now let us call the password compare function from the schema. SInce it is instance method we can call it from
    any document just like loginUser*/

  // const comparePassword = await loginUser.passwordCompare(
  //   password,
  //   loginUser.password
  // );

  // if (!loginUser || !comparePassword) {
  //   return next(new appError("incorrect email or password", 401));
  // }

  /* there is one small problem with above sytle of coding.If there is no such email then we do not need to 
  compare password. SO the solution is we can pass password comparing functionality right into the if statement. */
  if (
    !loginUser ||
    !(loginUser.passwordCompare(password, loginUser.password))
  ) {
    return next(new appError("invalid email or password", 401));
  }

  /*Making and sending token to user if all the information is correct. Well we can refactor the code by making 
a function that genereates the token so that we can call it as many times as we want. */
  // const token = tokenMaker(loginUser._id);
  // res.status(200).json({
  //   status: "success",
  //   token,
  // });

  createAndSendToken(loginUser, 200, res);
});

//PROTECTIN

/*Now we will learn to protect routes. We will check the token if valid then access if not denied

Suppose let say only the verified user gets access to all tours.
So we will make a middleware function that checks the user and then only we will give them access to 
.get(tourController.getAllTour). so the final version will be .get( middleware,tourController.getAllTour)

*/

exports.protect = catchAsync(async (req, res, next) => {
  //1 get the token and check if it exist
  /*Token is sent along the header that have header name "authorization" which value starts with "Bearer " followed 
by token string like "Bearer hdlfjlwer2465466". So to check if there is token we have to check it from request*/
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 1a let us see token

  if (!token) {
    return next(new appError("not logged in", 401));
  }

  //2 validate the token
  /* 
we can use const decoded=await jwt.verify(token,process.env.SECRET_KEY);
console.log(decoded)
to verify or we can alos use node's promisify. Profimisify takes the function to call. So we will pass jwt.verify in 
it and then we will call it like below

*/
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  console.log(decoded); //this deocoded gives us payload which contains id that can be used in step 3 and 4
  /*There can be two types of error coming from the jwt one is invalid token and another is token expired.
  So let us handle those two errors in our golobalerror handler function in PRODUCTION mode.
  
  */

  //3check if user still exists
  /*Since token has expiry time. What if the user deactivated accout but someone got the token? In that case
  they can access. OR another case is if passoword was changed but the old token is still valid for certain period
  of time. So we need to fix that also, in step 3 and 4 */
  const userStillExists = await UserModel.findById(decoded.id);

  if (!userStillExists) {
    return next(new appError("user no longer exists", 401));
  }

  //4 check if user changed password after the token was issued

  /* Just like confirming password we will make instance method to check if the password was changed or not
  inside the user Schema.*/
  if (userStillExists.changedPasswordAfter(decoded.iat)) {
    return next(new appError("password was changed. Please login agian", 401));
  }
  req.user = userStillExists; //this line of code is needed in the future.

  next();
});

//AUTHORIZATION

/*Now once everyting is okay with user it is time to give authorize them. Who can do what? Admin can do anything
user can do anything with their persenal data but not logged in user cant do anything. This is what we gonna learn
now. So we will make another middleware function to authorize.

logic:
make role field with some roles iniside enum so that no other role can be specified with default one.
This is the first time we are passing argumnet to middleware which generally we cant. So need the concept of
closure or wrapper function. 
The line of code in 274 will be now used to extract the user role. This is accessible because we will chain
middle like tourController.deleteTour(protect,authoriseRole,deleteTour). 

steps: Make role field 
make middleware 
finally test them.
*/
exports.restrictTo = (...roles) => {
  //(...roles) contains the parameter passed while calling middlreware from tourRoute
  console.log(roles);
  //we want closure to return middleware function.
  return (req, res, next) => {
    /*let us check if the role authorzed while calling this middleware exist in the shchma or not? if not
    then we cant perform certain actions like deleting tour */
    if (!roles.includes(req.user.role)) {
      return next(new appError("Unauthorized", 403));
    }
    //if role matches in both tourController and the schema now we allow them to perform
    next();
  };
};

//RESET PASSWORD:
/*  Find the user using email. Then create reset token using crypto. This token is hased to save in database
and unhased is sent to user so that user entered correct value. We will also modify token expiry field at the time
of token creation and save the user model. Remove all the validations.*/

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1 get user based on posted email

  const resetUser = await UserModel.findOne({ email: req.body.email });

  if (!resetUser) {
    return next(new appError("no user with that email", 404));
  }

  //2 generate random token
  /* we need to make instance method to generate token based on the data.
  this instance method is modifiying expires date so we need to save it. To save we have to specify all the
  required field but we have one specail propery that we can use in order to deactive validation as shown below */
  const resetToken = resetUser.createPasswordResetToken();
  await resetUser.save({ validateBeforeSave: false });
  //3 send that token back to that email.
  /*let make email.js file in the util folder all the details are there. */
  // http://localhost:4000/user/forgotPassword/resetToken
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/user/resetPassword/${resetToken}`;

  const message = `go to ${resetUrl} in order to reset your password `;

  //now all ready just call sendEmail module.

  // await sendEmail({
  //   email: resetUser.email,
  //   message: message,
  //   subject: "reset password",
  // });

  /* If the error happens while sending email In such case we just cant simply call the global error handle
  because it is good practise to reset both passwordResettoken and passwordTokenExperisAt so that the reset
  token does not fall into wrong hand. And after doing that we will call global error handler */

  try {
    await sendEmail({
      email: resetUser.email,
      message,
      subject: "Reset Password",
    });
  } catch (error) {
    //let us reset first and then we will call gobal handler
    resetUser.passwordResetToken = undefined;
    resetToken.passwordResetExpiresAt = undefined;
    //whenever we modify document we need to save the them in order to make changes
    await resetUser.save({ validateBeforeSave: false });
    //now it is time to give message to user
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
  //since token sent to user is unhased so we will hash it and then find user from token
  const hashedResetToken = await crypto
    .Hash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log(hashedResetToken);
  let resetUser = await UserModel.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetExpiresAt: { $gte: Date.now() },
  });
  //if password reset token is not greate than current time then it indicates reset token has experied

  //check for users and reset token time
  if (!resetUser) {
    return next(new appError("invalid user or token expired", 400));
  }

  //everything is okay. Now let save password
  resetUser.password = req.body.password;
  resetUser.passwordConfirm = req.body.passwordConfirm;
  //now we no longer need to save reset token and its expiry time.
  resetUser.passwordResetToken = undefined;
  resetUser.passwordResetExpiresAt = undefined;

  //since we modified the document so we need to save them.
  /*unlike in creating reset token which was post method and user schema for posting data needs all the field to
be validated as predefined. But in this case it is patch request and it only needs just two fields because
all the other fields are there. Further we have validator for password and passowrdConfirm so we can just
save the new password where we need to confirm them  using validators. So we dont deactivate them. */
  await resetUser.save();

  // now we have to make jwt for the user since its password was changed.

  // const newTokenAfterChangingPassword = tokenMaker(resetUser._id);
  // res.status(201).json({
  //   status: "password changed",
  //   newTokenAfterChangingPassword,
  // });
  createAndSendToken(resetUser, 201, res);
});

//UPDATE PASSWORD
/*Assuming that user is logged in and we ask them to enter the password. In our schema we have password
comparision method which should return true. Else the password was incorrect. Exit the operation */

exports.updatePassword = catchAsync(async (req, res, next) => {
  //let us get the infromation about that user from token since it is logged in.

  const updateUser = await UserModel.findById(req.user.id).select("+password");
  console.log(updateUser);

  //2 check the if POSTed current password is correct
  /*we will tell user to enter currentPassord e.g coolneon23 and then we will compare with the database ond */
  if (
    !(await updateUser.passwordCompare(
      req.body.currentPassword,
      updateUser.password
    ))
  ) {
    return next(new appError("invalid password", 401));
  }

  //3 update the password
  updateUser.password = req.body.newPassword;
  updateUser.passwordConfirm = req.body.confirmNewPassword;

  await updateUser.save();

  /*4 send jwt. This time we will refactor the code that was used to make and send new token every time into
  a function keeping in mind that we need database user's id, status code and res to pass into that function. */

  // const newTokenAfterPasswordUpdate = tokenMaker(resetUser._id);
  // res.status(201).json({
  //   status: "password changed",
  //   newTokenAfterChangingPassword,
  // });

  createAndSendToken(updateUser, 200, res);
});

/*I guess this all we need about the user authentication. Now we will learn about updatating user's information
like email,name,addresss. So for that i will make controller right in the user controller. */

/*Security part */

/*Cookie.:- cookie is the place where the browser stores the token so that token is more sucured than just 
      sending it to the client. Logic is very simple create the token and store it inside the cookie using
      res.cookie(cookieOption). This cookie option is parameter we pass in order to add additional security
      
  Ok now let us refactor our createAndSendToken function     
  */

/*rate limiter:
  
                Rate limiter is another cool feature to prevent our app from DOS and bruteforce attack.
        Let us implement it in the app.js file     
  */

/* Setting security headers:

                              We can set sucurity headers for additional security. Since it also a package that
                              need to be installed , called and used as middleware. Let implemnet in app.js file`
  
  */
