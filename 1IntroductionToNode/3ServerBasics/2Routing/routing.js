/* Routing:
            Once the server is created we can route to different pages based on the requested url.
            For that we check req.url as shown below.

*/
const http = require("http");
const server = http.createServer((req, res) => {
  //Check the req's url to first
  if (req.url == "/home") {
    res.end("welcome to home page");
  }

  if (req.url == "/about") {
    res.end("welcome to about page");
  } else {
  /* What if user request for the page which does not exists? For that we will use else part. Inside of that just 
send the response with sataus code of 404 which mean not found.  */
    /*writeHead is a method in which we send the infromation about the response. As shown  below if the page is not 
  found then the response will say "page Not found" which is of text/plain type. 
  If we want to send "page Not found" as heading tag of html then {"Content-Type":"text/html"}.

  Moreover these information is called headers. We have setHeader method to do that but writeHead is a general 
  method for setting headers,status code at once.Which makes life beautiful. 
  
  */
    res
      .writeHead(404, { "Content-Type": "text/html" })//browser is expecting some html
      .end("<h1>page Not found</h1>");

      /*headers must be set before the response ie response.end()  */
  }
});

server.listen(3000, () => {
  console.log("server is running at port 3000");
});
