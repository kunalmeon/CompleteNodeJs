/*promise are those from which we expect value in future. e.g if fetch data from server the 
server will promise us some data which will come in future.
In case of promise we have two methods one is called then() which is called incase of successful
result/promise and can be chained with other then() methods, these then methods takes callback
function and in it's argument we pass the variable that stores the data given by the promise.
Second one is called catch() method which is also takes callback function with error as an argument.
This catch() method will be called when we have error or unsucessful promise.


Let us do the callback hell example with promise.

*/


/*VVIMP:
        Unlike front end where i used React which is a library Node need to install library to fetch
        data. Some of them are superagent or node's node-fetch. But there is small difference 
        between client end fetch and backend fetch. Once we get resolved promise in backend we have
        the body key in the resolved/successful promise where the data lies as shown in below.
        But we dont need such body in front end. 
*/

const fs = require("fs");
fs.readFile(`${__dirname}/breed.txt`, "utf8", (err, data) => {
  if (err) console.log("file not foud");
  console.log(data);
  require("superagent")
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then((response) => {
      fs.writeFile(
        `${__dirname}/dogimage.txt`,
        response.body.message.toString(),
        (err) => {
          if (err) console.log("could not write into file");
          console.log("successfully written");
        }
      );
    })
    .catch((err) => {
      console.log(err.message);
    });
});

/*Though using promise looks a little better than that of callback hell but the main problem still reamins i.e
callback inside the callback. */
