require("dotenv").config({ path: "./settings.env" });
const mongoose = require("mongoose");
process.on("uncaughtException", (err) => {
  console.log(err.stack);
  console.log(`shutting down server due to ${err}`);
});

const app = require("./app");

console.log(process.env.NODE_ENV);

const databaseurl = process.env.DATABASE_URI.replace(
  "<password>",
  process.env.PASSWORD
);


mongoose
  .connect(databaseurl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected");
  });

let port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`server is listening at port ${port}`);
});

// process.on("unhandledRejection", (err) => {
//   console.log(err);
//   console.log(`shutting down server due to ${err.message}`);
//   server.close(() => {
//     process.exit(1);
//   });
// });
