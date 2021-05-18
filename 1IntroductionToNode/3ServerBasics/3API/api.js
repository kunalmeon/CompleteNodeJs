/*API is the service from which we can request the data.  To get more concept let us request data 
form the data.json file.*/
const data = require("fs").readFileSync(`${__dirname}/data.json`, "utf8");
let virus = {
  name: "corona",
  level: "fatal",
};
const server = require("http").createServer((req, res) => {
  if (req.url === "/data") {
    // require('fs').readFile(`${__dirname}/data.json`,'utf8',(err,data)=>{
    //     if(err){
    //         console.log('could not read the file')
    //     }
    //     else{

    //         res.end(data)
    //     }
    // })

    /* This way of reading file is not good in this case beacuse for every '/data' url server have to read file
     agian and agian so instead we can read file sync way in this case only. */
    res.writeHead(200, { "Content-Type": "application/json" }).end(data);
  }

  /* Note: WE can not send javascript object in the response. So we need to convert it into string first as shown
below.

 For .toString(), a default value is returned when the argument type is an object. JSON.stringify on the other hand 
 returns JSON text, which can be converted back into a JSON object by using JSON.parse
*/
  res.end(JSON.stringify(virus));
  let objectIntoJsonString=JSON.stringify(virus);
  let backToObject=JSON.parse(objectIntoJsonString);
  console.log(`to string:${objectIntoJsonString}`);
  console.log(`back to object ${backToObject}`)
  console.log(`checking object${backToObject.name}`)
});

server.listen(3000, () => {
  console.log("server is listening at port 3000");
});
