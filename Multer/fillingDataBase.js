const dotenv = require("dotenv");
dotenv.config({ path: "./settings.env" });
const mongoose = require("mongoose");
const tourModel = require("./models/tourModel");
const fs = require("fs");

/* Select the file ie. fillingDataBase and then --delete to delete or --import
data into database just like "node ./fillingDataBase --import". Note that the server 
is running. */

const DATABASEURI = process.env.DATABASE_URI.replace(
  "<password>",
  process.env.PASSWORD
);

mongoose
  .connect(DATABASEURI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((error) => {
    console.log(error.message);
  });
console.log(process.argv);

const dataToWriteIntoDatabase = JSON.parse(
  fs.readFileSync("./data/tours.json", "utf8")
);
console.log(dataToWriteIntoDatabase);
const fillData = async () => {
  try {
    console.log("connecting databse");
    await tourModel.create(dataToWriteIntoDatabase);
    console.log("document written");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteTours = async () => {
  console.log("connecting databse");
  await tourModel.deleteMany();
  console.log("all documents deleted");
  process.exit();
};

if (process.argv[2] === "--import") {
  fillData();
}

if (process.argv[2] === "--delete") {
  deleteTours();
}
