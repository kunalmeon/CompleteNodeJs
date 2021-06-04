/*callback within the callback can create alot of confusion.  We will read the dog breed name 
from the breed.txt file and then we will fetch for the image using superagent package and then
we will write the data back into the new file called godimag.txt.

*/

require("fs").readFile("./breed.txt", "utf8", (err, data) => {
  require("superagent")
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      let dogimage = res.body.message;

      require("fs").writeFile(`${__dirname}/dogimage.txt`, dogimage, (err) => {
        if (err) console.log("error while writing");
      });
    });
});

/* inside file read callback we have another  callback for fetching data and once data is fetched we have
another callback to write into the file. The callback inside callback can be messy so it is called callback hell.
What is the solution ?
*/
