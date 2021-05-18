/*Template are the html file which lies in the server side. In this topic we will make two templates one for the 
overview which contins the details about all the product and another template for the product which will contain
additional information about the pertcular product. 

The basic idea is to use place holder for product name,country,image,etc in template file and then we
will fill those place holder with actual data from the data.json file. 


Now go to product template and use placeholders.

After using place holder we need to fill them. So first we will read the templates in sync way and then we have
temp.replace() method to fill all the palceholders.

*/
let overviewTemp = require("fs").readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf8"
);
let productTemp = require("fs").readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf8"
);
let cardTemp = require("fs").readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf8"
);

//Now let us also read the data which will be filled inside the templates.

let data = require("fs").readFileSync(
  `${__dirname}/dev-data/data.json`,
  "utf8"
);

/*since data is read as utf8 encoding so it will be string and thus we need to covert it into JS object
in order to perform loop. */

let dataObj = JSON.parse(data);

/* now it is time to make server with simple routing for product and overview page. */

//1 making template filling function
function fillPalceHolder(productdata, templatecard) {
  //It is bad practise to directly modifiy the original content so we will make new content for temp card(single one)
 
  /* we can replace placeholder easily but we have to store the every new change to somewhere so let us make a new 
varaible for that */

  let stroingAfterFillingTemplate = templatecard.replace(
    /{%IMAGE%}/g,
    productdata.image
  );
  /*
//Now all the changes will be made into the storing varaible.But we need to store somewhere so instead of making 
new varible for every placeholder change we will modify it into storingAfterFillingTemplate variable that is the 
reason why variable is declared as "let"

*/
  stroingAfterFillingTemplate = stroingAfterFillingTemplate.replace(
    /{%PRODUCT_NAME%}/g,
    productdata.productName
  );
  stroingAfterFillingTemplate = stroingAfterFillingTemplate.replace(
    /{%QUANTITY%}/g,
    productdata.quantity
  );
  stroingAfterFillingTemplate = stroingAfterFillingTemplate.replace(
    /{%PRICE%}/g,
    productdata.price
  );
  if (productdata.organic)
    stroingAfterFillingTemplate = stroingAfterFillingTemplate.replace(
      "{%ORGANIC%}",
      "organic"
    );
  if (!productdata.organic)
    stroingAfterFillingTemplate = stroingAfterFillingTemplate.replace(
      "{%ORGANIC%}",
      "not-organic"
    );
  stroingAfterFillingTemplate = stroingAfterFillingTemplate.replace(
    /{%ID%}/g,
    productdata.id
  );

  //filling placeholder for product details.
  stroingAfterFillingTemplate = stroingAfterFillingTemplate.replace(
    /{%COUNTRY%}/g,
    productdata.from
  );

  stroingAfterFillingTemplate = stroingAfterFillingTemplate.replace(
    /{%NUTRIENTS%}/g,
    productdata.nutrients
  );
  
  stroingAfterFillingTemplate = stroingAfterFillingTemplate.replace(
    / {%DESCRIPTION%}/g,
    productdata.description
  );
  
  return stroingAfterFillingTemplate;
}

//2 Building product page 

const server = require("http")
  .createServer((req, res) => {
    
    //1Overview page
    if (req.url === "/" || req.url === "/overview") {
      //fill the placeholder of one card i.e cardTemp with the data and show them.
      let alltheCardsAfterFilling = dataObj.map((eachProduct) =>
        fillPalceHolder(eachProduct, cardTemp)
      );

      //after filling all the cards using map loop we have to replace  {%PRODUCT_CARDS%} with  alltheCardsAfterFilling
      let finalView = overviewTemp.replace(
        /{%PRODUCT_CARDS%}/g,
        alltheCardsAfterFilling
      );
      //Finally we can send it to browser
      res.writeHead(200, { "Content-Type": "text/html" }).end(finalView);
    }

    //2 Product page
    /* www.helloworld.com is the url which we can convert into object using url module's parse method.
    In this case we need is pathname and the id. This id lies in the query object. */
    const url=require('url');
    const {query,pathname}=url.parse(req.url,true)
if(pathname==='/product'){
   const productToShow=dataObj[query.id];

   /*Since we are using same method to show overview and the product detail we can do one simple thing to save time
   i.e we can fill all the placeholder inside the function and based on the place holder it will automatically
   select and fill them */
  const output= fillPalceHolder(productToShow,productTemp);
  res.end(output)
}
  })
  .listen(3000, () => {
    console.log("server is listening at port 3000");
  });
