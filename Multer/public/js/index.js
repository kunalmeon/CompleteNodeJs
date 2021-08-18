/* 
 5a)Since we are bundling login.js file and alert.js file in here, we will need email and password
 and other function like login in order to perform login and alert functionality.
 So we have to modify login function a lil bit so that we can import required data in oder to bundle them 
 together.

*/
import {login} from './login'
import '@babel/polyfill'

// document.querySelector("form").addEventListener("submit", (e) => {
//   e.preventDefault();
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
//     login(email, password);
// });


/*5b) Since login function needs axios we will import it into the login.js file and also polyfill
to support older browser "npm i @babel/polyfil" */

/* 5c) In order to prevent form error happening we can check wether the perticular thing exists or
not.  */
const form=document.querySelector('.form');
if(form){
    form.addEventListener('submit',(e)=>{
        e.preventDefault();
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        login(email,password)
    })
}


/* 7 a3)  So once the user click the logout button let us call that logout function.*/
import {logout} from './login'
const logoutBtn=document.querySelector('.logOut');
if(logoutBtn){
logoutBtn.addEventListener('click',logout)
}

/* 7 a3 i) Once we logged out we have sent dummy jwt in the cookie but the problem is we have isLoggedIn
middleware in the authcontroller which will fail to verify this dummy jwt token because it
is checking jwt in the cookie if user is logged in or not. Since we cant delete jwt we send dummy
jwt. So jwt.verify will send an error due to which page with login option will not render. 
So let us fix that middleware by removing cathAsync function such that if token does not varifies let us
 let refactor that isLoggedIn function  */


 /*10 cont..) import updateData function  and the form From the user account    */
//  import {updateData} from './updateSettings'

/*11 a cont...) Import updateSetting function */
 import {updateSettings} from './updateSettings'

 const userAccoutUpdateForm=document.querySelector('.form-user-data')
 if(userAccoutUpdateForm){
     userAccoutUpdateForm.addEventListener('submit',(e)=>{
         e.preventDefault();
         const email=document.getElementById('email').value;
         const name=document.getElementById('name').value;
        updateSettings({name,email},'data')

     })
 }


 /*11) Our next challange is to update the password.
 The logic is similar to updating data. So we can implement both features inside same function.
 In api we have localhost:4000/api/updateMe which expects current password new password and confirm
 password. So we will pass object for updating data and password + type variable based on which we will
 switch api between data and password.

 Go to updateSettngs.js file

 
 */

 /* 11 b) Now it is time to select password update from from the accout.pug and select the fields
 that the api needs and then update password using updateSettings function. */

 const passwordForm=document.querySelector('.passwordUpdateForm')
 if(passwordForm){
    // {
        //api data that need to be sent in order to update password
    //     "currentPassword":"123456789",
    //         "newPassword":"jayShambho",
    //         "confirmNewPassword":"jayShambho"
    //     }

//Note while making variable they must be same as those defined in schema
passwordForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
    /*11 c) We can now change the button for updating password in such a way that while password is
    being updated we can make it's value to Updating... and once done we can make it back to Save Password */
   
   document.querySelector('.password-button ').value='Updating...'
   
    const currentPassword=document.getElementById('password-current').value;
    const newPassword=document.getElementById('password').value;
    const confirmNewPassword=document.getElementById('password-confirm').value;
    
    /*NOw let us call updateSettings function by sending these inforamtions along with type 
    Another thing is we want to implement a fucntionality that once the form has been submitted
    we want to empty all the field. For that we have to wait untill the password is updated
    because we are using axios inside it. So let us wait for it and once password has been updated
    we can empty the field
    */
    // updateSettings({currentPassword,newPassword,confirmNewPassword},'password');
    await updateSettings({currentPassword,newPassword,confirmNewPassword},'password');

/* 11 c cont) Once done now we can put button value back  */
document.querySelector('.password-button ').value='Save Password'


    //let us clear all the fields

    document.getElementById('password-current')=' ';
    document.getElementById('password')=' ';
    document.getElementById('password-confirm')=' ';



})

 }