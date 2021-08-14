const mongoose = require("mongoose");
/* install validator package to validate strings like email  */
const validator = require("validator");
const bycrypt = require("bcrypt");
const crypto = require("crypto");

//signup fields
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name"],
  },

  email: {
    type: String,
    required: [true, "please provide your email address"],
    unique: true,
    lowercase: true,
    //validating email format.
    validate: [validator.isEmail, "please enter valid email address"],
  },
  photo: String,

  password: {
    type: String,
    required: [true, "please provide password"],
    minLength: 8,
    //to hide password while getting list of all users.
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "password does not match",
    },
  },

  //protecting
  passwordChangedAt: Date,

  //reset password
  passwordResetToken: String,
  passwordResetExpiresAt: Date,

  //authorization based on the role,

  role: {
    type: String,
    enum: ["admin", "user", "ceo"], //only these values can be given at the time of signup
    default: "user",
  },

  //to activate or deactive by changing the value of active to true or false.
  active: {
    type: Boolean,
    default: true,
    select: false,
  },

  /* let us validate the confirm password.
  Note:"validate" property or field name only works at the time of schema creation. So anytime you update or create
  the password you need to  call the .create() or .save() method.
  */
});

/* Before saving to the database let us hash the password using bycrypt package . Hashing makes sense when the 
user is entering new or updating the password so we will use mongoose's .isModified() method to chech whether the
password is modified or not? . If so then we can hash the password and also we can remove the confirm field from the
database. We only need confirm field to conform the password. THere is no need of confirm password to be saved inside
the database. */


//query middlewares

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  /*note: hashing can be both sync or async. Async is better choice  */
  this.password = await bycrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

/*FIxing slower database save problem
sometime saving to database is slower than generating token. This might bring us problem of invalid token.
Since the password was changed later into database. So simple hack is let us make saving password faster by
decreasing time. */
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
});

//query middleware to hide deactive accounts

userSchema.pre(/^find/,function(next){
  this.find({active:{$ne:false}});
  next()
})



//Login
/* Making a instance method to compare password. And calling it inise the controller. */
userSchema.methods.passwordCompare = async function (
  userEnteredPswd,
  databaseSavedPswd
) {
  //we cant access password field of scehma since it is hidden using selecet=false.
  return await bycrypt.compare(userEnteredPswd, databaseSavedPswd);
};

//Protecting Route
/*to protect route if password was changed and still the token has validity time left.
Logic:compare Time of token issued and time of password changed. 
Password is changed after the successful login so if password was changed then "token time<password change time"
THis boolean value will be used inside the authcontroller.  
let us make a date field inside schema for that where we will pass date while singin up and then we will login
and then we will change the date from database and then using old token we will access the protect routes which should
deny. 
*/
userSchema.methods.changedPasswordAfter = function (tokenIssuedTime) {
  //convert password changed date into milli second since jtw issued time is in milli second.
  // console.log(tokenIssuedTime)
  //condition that someone changed password thus password changedDate field was created. We will do autmatically later
  if (this.passwordChangedAt) {
    const passwordChangedTimeInSec = parseInt(
      this.passwordChangedAt.getTime() / 1000
    );

    return passwordChangedTimeInSec > tokenIssuedTime; //future time is greater than past time
  }

  //   //by default no change in password so return false
  return false;
};

//RESET password instance method

userSchema.methods.createPasswordResetToken = function () {
  /* we will need node's ctypto to make random token.
  Once token is created then we have to hask it and digest it.
  We need to store this resetToken inside the database in order to compare it.
  
  */
  const resetToken = crypto.randomBytes(32).toString("hex");
  //token is then updated and saved using hasing algorithm like below.
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //we modified the date but not save it so from controller we have to save it. but the problem is .save() method
  // checks validations and the solution is .save({validateBeforeSave:false})
  this.passwordResetExpiresAt = Date.now() + 10 * 60 * 1000;
  // unhashed token will be sent to user and hased one will be stored in database in order to compare them.
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
