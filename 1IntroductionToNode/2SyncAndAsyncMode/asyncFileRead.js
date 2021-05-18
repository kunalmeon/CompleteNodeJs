const fs = require("fs");
fs.readFile("./readme.txt", "utf8", (err, data) => {
  if (err) {
    console.log("file not found");
  }
  console.log(data);
});
console.log("this will print first since the reading operation will take time");

/*Some concept about callback function. Callback is annonomus or arrow function which can
take any no of arguments. The convention is that first argument is always the error and rest are
according to the need.

                        Like in sync way after reading the file we need to store the content so for
                        that we have passed data as an argumnet. 
*/

/*Reading two files where reading second file depends upon the result from the first file.Let us do it */

fs.readFile(`${__dirname}/files/personname.txt`, "utf8", (err, data1) => {
  if (err) {
   return console.log("file not found");
  }
  fs.readFile(`${__dirname}/files/${data1}.txt`, "utf8", (err, data2) => {
    if (err) {
    return  console.log("problem on reading first file");
    }
    //We can also write after reading file.
    fs.writeFile(`${__dirname}/files/final.txt`, data2, (err) => {
      if (err) {
       return console.log(" no such file to write");
      }
      console.log("writing done");
    });
  });
});
