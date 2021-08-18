/*Note: In order to run code inside login.js file we need to include this file inside the base.pug file. */

/* First we will select the form element which was inside the login.pug template and then we will add
event listener on it for submit button */

// 1.b) Login function

// - script(src="  https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.jss")

// const login = async (email, password) => {
//   /* 1 b a) We have to make http request,for that we can use axios. This axios returns promise so we have to
//     wait for the response. All we are interested is response.data object. This data object holds all
//     the information about both successful or failed request. */
//     alert('logged successfully')
//   try {
//     const response = await axios({
//       method: "POST",
//       url: "http://127.0.0.1:4000/user/signin", //this is how front connects to backend
//       //now we have to send email and password as defined in schema.
//       data: {
//         email,
//         password,
//       },
//     });
//     /* 4. If the middleware worked Let us now render homepage automatically. */
//     if(response.data.status==='success'){
//       alert('logged in successfully');
//       window.setTimeout(()=>{
//        /*the logic is render the home page using the  url i.e we always have home page at this url.
//        THis can be done using location.assign('url where yor image lies')  */
//        location.assign('/');

//       },1500)
//     }

//     // console.log(response.data);
//   } catch (error) {
//     // console.log(error.response.data);
//     alert(error.response.data.message)
//   }

//   /*1 b 2) Once the user is successfully logged in we get the token. All the information we need
//   stays inside the response.data object. This token is stored inside the browser's cookie.
//   In order to access those cookie from the request we have to install certain middleware in express
//   which is called cookie-parser package. Let us install it.

//   Once we installed Now we can access cookie. So in our backend  code we can check for token from two
//   different palces, one from the authorization header ie. bearer and another from the cookies. So let
//   us go to authorization and implement token getting fucntinality from the cookie.
//   */
// };

// //1 selecting the form element and adding event listner on it
// document.querySelector("form").addEventListener("submit", (e) => {
//   e.preventDefault();
//   // 1.a) Now we have to get the email and password from the form
//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   /* 1.b) Once we got email and password it is time to make login function. The logic is written there */
//   login(email, password);
// });

/* 2 . Once the user is logged in we now have to render logout or user profile or someother function 
based on some functionality. We implement that logic in authcontroller.  */

/*5 web parcel 
Once we have made user navigation now let us refactor our base.pug file. Since we have many js file
in it, we will combine them into one single file using web parcel and then the combined file
will be used in the base.pug file. So let us intall it "npm i parcel-bundler --save-dev"

Once we have installed it we need to set command inside pacake.json file in order to set the
file location in which all the file will be bundled together. This command starts with 
"watch.js":"parcel watch ./public/js/index.js --out-dir ./pulic/js --out-file bundle.js"
index.js file is the entry point and bundle.js file is the output. Let us create those file.

To bundle file we have to run command "npm run watch.js " in the terminal.
So now we have to import that output file i.e bundle.js into the base template. 
Summary combine all javascript file into one single file and then use that file into the base.pug file.


Once we have set parcerl,entry point(index.js) and the output file(bundle.js) the next work is to
bring all the javasrcipt file into the entry point file in order to bundle them.

Let us go to index.js file and the logic is right there

*/

/*5 a 1) Now let us refactor above code so that we can export data and other fucntionality in order
to bundle them in entry point index.js file.
Note: we can write form code directly into the entry point file. This technique wont effect login function
because we are placing everything in one palce
*/
import axios from 'axios'
/*6a) Importing alert functionality and using it  */
/*7) Now it is time to make logout fucntionality.  */
import {showAlert} from './alert'
export const login = async (email, password) => {
  
  try {
    const response = await axios({
      method: "POST",
      url: "http://127.0.0.1:4000/user/signin",

      data: {
        email,
        password,
      },
    });
    if (response.data.status === "success") {
      showAlert('success','Logged in Successfully')
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (error) {
  showAlert('error',err.response.data.message)
  }
};


/* 6) Now let us alert functionality */


/*7 a2) Once we have made route that will give dummy cooke in the backend now it is time use that 
route in the front end. */

export const logout=async()=>{
  try {
    const response=await axios({
      method:"GET",
      url:"http://127.0.0.1:4000/user/logout"
    })
    /*Logic: once we hit logut route and if the response.status==='success' then we have to reaload
    the page so that login  button and other stuffs appears. So let us do that. */

    if(response.data.status==='success'){
      location.reload(true);
      /*
    VVIP:we need to pass reload parameter to the .reload method so that page reloads from the browser
      not from the cache */
    }
  } catch (error) {
    showAlert('error','Error in logging out! Try again later')
  }
}

/*7 a3) Now similar to login function let us bundle the code in index.js file. */


/*8. Now it is time to render error page that we will manually create. The logic is if someone hits
the wrong url for front end case then we will make an error object from appError class in order to pass
that error to global error handler. Once error is object is passed we can then render an error page 
using some information from that passed error object like status code . 

Note: One small change we have to make is that since global error handler handles both api error and
front end page error we can put the same logic logether. This is done by first checking url using
req.originalUrl.startsWith(). If url starts with /api/.... ie. for api like getting user or tour from
database but if it does not starts with /api meainig that this error was for front end portion so we
we can render the error page that we have created manually. Let us dive into the global error handler.

Go to globalErrorHandler file.
*/