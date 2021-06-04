/*let us make code much easier to read and clean to see. The concept of asyc + await it that 
instead of .then() method we can use await, this await waits for the promise to complete. But
to use await the function inside of which we are using it should be async and for those we are 
waiting must be promises. 

let us make one example that shows some data about the USA and store them into the new file.

*/
const fs = require("fs");
function readUsaApi(pathname) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathname,'utf8', (err, data) => {
      if (err) reject("cant read the file.");
      resolve(data);
    });
  });
}

function writeIntoFile(pathname, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(pathname, data,(err) => {
      if (err) reject("could not write since no data came ");
      resolve('successfully written');
    });
  });
}

async function getUsaData(){
try {
    //let us read the file and wait for the result. 
//Since readUsaApi is returning promise we can use await
const api=await readUsaApi(`${__dirname}/api.txt`);
console.log(api)
//Now let us get data from API using superagent.
const superagent=require('superagent');
//Since superagent.get() method also returns promise we can use await here also.
const response= await superagent.get(`${api}`);
console.log(response.body)
let data=JSON.stringify(response.body,null,'\t');

//Now let us write the data into the file
await writeIntoFile(`${__dirname}/usadata.txt`,data)

} catch (error) {
    console.log(error)
}


}
/*Since async await has no error handling mechanism so we can use any javascript error handling mechanism like try
promise and cath the error is promise rejected */

//Now let us call the function
getUsaData()