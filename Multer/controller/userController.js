const catchAsync = require("../utils/catchAsync");
const userModel = require("../models/userModel");

const appError = require("../utils/appError");

exports.getAllUser = catchAsync(async (req, res, next) => {
  const userList = await userModel.find();
  res.send(userList);
});
exports.createNewUser = catchAsync(async (req, res, next) => {});
exports.getSingleUser = (req, res, next) => {
  res.status(500).json({
    status: "failed",
  });
};

/*To update fisrt the user must be logged in that is why we have use protect middleware before updating and second
thing is that we need to allow user to update only certain fileds not the sensitive fileds like password or jwt
token. That is why we have use authcontroller in order to change password. So how do we filter the that data 
coming from the body so that this /updateMe route only takes certain fileds . 

Logic:We will make an array from the req.body and another from the value of allowed filled. Based on allowed fields
we will loop them to filter . This is pure javascript thing.

Now let us know about findOneAndUpdate() method. This one excepts the condition by which we want to find user and
the value we want to update and finally we have to save it using new:true. 
*/


exports.updateMe = catchAsync(async (req, res, next) => {
  /*1 c Cont...) Let us check photo information  from the postman. Once we choose the photo and other
  information the image file will be saved as "71b40038d4d4f9709f07c5d0b357d398" in our file system. */
  console.log(req.file);
  console.log(req.body)
  let filteredObject = {};
  const bodyObject = req.body;
  const allowedFiledsToUpdate = ["name", "email","photo"];
  Object.keys(bodyObject).forEach((el) => {
    if (allowedFiledsToUpdate.includes(el)) {
      filteredObject[el] = bodyObject[el];
      //key name            //value karan       fileterdObject={name:"karan"}
    }
  });

  const updateUser = await userModel.findByIdAndUpdate(
    req.user.id,
    filteredObject,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: updateUser,
  });
});

exports.deleteUser = (req, res, next) => {
  res.status(500).json({
    status: "failed",
  });
};

/*
DELETE ME:
       Delete does not mean that we have to delete all the data of user because there might be chances of user coming
          back. So all we can do is deactive them using "active" field in the schema


*/

exports.deleteMe = catchAsync(async (req, res, next) => {
  const deleteUser = await userModel.findByIdAndUpdate(req.user.id, {
    active: false,
    new: true,
  });
  res.status(204).json({
    status: "deactivated",
  });

  /*so the deactivated account should not be shown while requesting all the users.
  For that we have to use 'find' query middleware with condition to show all the users expect one with active
  status to false. Lets do that in user model
  */
});
