/* I clearly  know that the async function also returns us promise. If so then if we are returning 
something from asyc function we can use that returned value into the .then() method or we can
also use async fucntion in order to use await for the cleaner code. 

What about error handling?

                            In order to handle error we have to use throw() method. Let us take an
                            example and then i will explain more.

*/
// const fs = require("fs");
// function fileReadPromise(filepath) {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filepath, "utf8", (err, data) => {
//       if (err) reject("file not found");
//       resolve(data);
//     });
//   });
// }

// function fileWritePromise(filepath, data) {
//   return new Promise((resolve, reject) => {
//     fs.writeFile(filepath, data, (err) => {
//       if (err) reject("could not write ");
//       resolve();
//     });
//   });
// }

// async function getLocation() {
//   try {
//     const api = await fileReadPromise(`${__dirname}/api.txt`);
//     console.log(api);
//     const response = await require("superagent").get(`${api}`);
//     console.log(response.body);
//     await fileWritePromise(
//       `${__dirname}/location.txt`,
//       JSON.stringify(response.body, null, "\t")
//     );
//   } catch (error) {
//     console.log(error);
//   }
// }

// getLocation();



/*Error Handling? 
we can use .then() method or another async await but the real challange is even if there is error in the reject()
 method of executor function of custom Promise .then() or async await of geoLocation() which is async function
 in our example will run. 


                    Solution is we have to throw error for the async geoLoaction(). ie. make two error handler
                    one for custom Promise and another for async function i.e geoLocation() 



*/

const fs = require("fs");
function fileReadPromise(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, "utf8", (err, data) => {
      if (err) reject("file not found");
      resolve(data);
    });
  });
}

function fileWritePromise(filepath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, data, (err) => {
      if (err) reject("could not write ");
      resolve();
    });
  });
}

async function getLocation() {
  try {
    const api = await fileReadPromise(`${__dirname}/api.txt`);
    console.log(api);
    const response = await require("superagent").get(`${api}`);
    console.log(response.body);
    await fileWritePromise(
      `${__dirname}/location.txt`,
      JSON.stringify(response.body, null, "\t")
    );
  } catch (error) {
    console.log(error);
    //throwing error for whole function i.e geoLocation()
    throw('ERROR!')
  }

  return 'value returned from asyc function'
}


//Since we are using async await we will use same concept

(async()=>{
try {
    const valueReturned=await getLocation();
    console.log(valueReturned)
} catch (error) {
    console.log(error)
}

})()