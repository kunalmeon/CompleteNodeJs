// const fs = require("fs");
// fs.readFile(`${__dirname}/breed.txt`, "utf8", (err, data) => {
//   if (err) console.log("file not foud");
//   console.log(data);
//   require("superagent")
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((response) => {
//       fs.writeFile(
//         `${__dirname}/dogimage.txt`,
//         response.body.message.toString(),
//         (err) => {
//           if (err) console.log("could not write into file");
//           console.log("successfully written");
//         }
//       );
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

/* 
/*Anything that accepts callback funtion can be converted into Promise. This conversion of callbacks
into promise helps us to get rid of callback hell. For example we have callback function in file 
read system which either give us  data or error. This data or error can be passed into the 
executor function inside the promise. 


One more thing is we can chain multiple then() methods of promise if and only if something returns
the data/promises in the future e.g fetch('hello.com') gives us the data or error in future.




In order to do that we will make functions which retruns the promise oject by using new Promise();
This new Promise() takes executor function with two argument on for successful and other for 
unsuccessful promise like earlier. This two argument are also function. In resolve() function
we pass the data which we get after the successful result,similarlly we pass error in reject.

After this we can collect the data in then() method like before. Note:WE can chain several .then()
method if something is returing us promise. Let us modify above code and let us see how we can get
rid of the callback hell using custom promise.



*/

const fs = require("fs");

const fileReadPromise = (filepath) => {
  // return promise
  return new Promise((success, failed) => {
    /* read the file first and then call success for data or failed method for error */
    fs.readFile(filepath, "utf8", (err, data) => {
      if (err) failed("cant read file"); //if true catch will ba called
      success(data); // if true .then() can have data
    });
  });
};

const writeFilePromise = (filepath, datatowrite) => {
  return new Promise((success, failed) => {
    fs.writeFile(filepath, datatowrite, (err) => {
      if (err) failed("failed");
      success("written");
    });
  });
};

/*Now let us read the file and the fetch url and then save the content into anothe file. */

fileReadPromise(`${__dirname}/breed.txt`)
  .then((data) => {
    return require("superagent").get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
  })
  .then((dogImage) => {
    console.log(dogImage.body.message);
    return writeFilePromise(
      `${__dirname}/dogimagez.txt`,
      dogImage.body.message
    );
  })
  .then(() => console.log("file written"))
  .catch((err) => {
    console.log(err);
  });


  /*Note all the error rejceted during failed will be handled by single cath down below. */