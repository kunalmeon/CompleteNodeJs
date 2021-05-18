/* To read a file first we need to specify the file which to be read and the the way we want
to read file i.e encoding here we use utf8 */

const fs=require('fs');
let fileRead=fs.readFileSync(`${__dirname}/txt/input.txt`,'utf8');
console.log(fileRead);


/* Now let us write into file. Here we have used synchronous way we also can use async way.  */

const textToWrite=`This is what we know about the avocado: ${fileRead}./n created at ${Date.now()}`;
fs.writeFileSync(`${__dirname}/txt/output.txt`,textToWrite)


