/*Note: In order to run code inside login.js file we need to include this file inside the base.pug file. */

/* First we will select the form element which was inside the login.pug template and then we will add
event listener on it for submit button */

// 1.b) Login function

// - script(src="  https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.jss")
import {axios} from axios
class Login{
  
  constructor(email,password){
    this.email=email,
    this.password=password
  }
  login(){
     async (email, password) => {
      /*We have to make http request,for that we can use axios. This axios returns promise so we have to
        wait for the response. All we are interested is response.data object. This data object holds all
        the information about both successful or failed request. */
      try {
        const response = await axios({
          method: "POST",
          url: "localhost:4000/user/signin", //this is how front connects to backend
          //now we have to send email and password as defined in schema.
          data: {
            email,
            password,
          },
        });
        console.log(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    

  }
}
//1 selecting the form element and adding event listner on it
document.querySelector("form").addEventListener("submit", (e) => {
  // 1.a) Now we have to get the email and password from the form
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  /* 1.b) Once we got email and password it is time to make login function. The logic is written there */
  const loginClass=new Login(email,password)
  loginClass.login()
});
