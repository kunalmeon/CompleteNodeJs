const express=require('express')
const viewController=require('../controller/viewController')
const router=express.Router();
/* 2 Let us show user information like logout or profile once the user has logged in for all pages. For that
we will use isLoggedIn middleware that we have created in authcontroller. */
const authcontroller=require('../controller/authController');


//Font-End 3) Now let us implement user navigation(logout) in the header file.
// router.use(authcontroller.isLoggedIn)
// router.get('/',viewController.overview)
// router.get('/tour/:slug',viewController.getTour);
// router.get('/login',viewController.logIn);


router.get('/',authcontroller.isLoggedIn,viewController.overview)
router.get('/tour/:slug',authcontroller.isLoggedIn,viewController.getTour);
router.get('/login',authcontroller.isLoggedIn,viewController.logIn);

//9 cont... Render accout.pug file.
router.get('/me',authcontroller.protect ,viewController.getAccount)
/*The problem is jwt will be checked twice one due to authcontroller.isLoggedIn and another due to
authcontroller.protect. So we can refactor above code. 

Another thing we have to place current user in the authcontroller.protect middleware so that the
user can be used in any template which uses protect rote just like authcontroller.getAccount is
using account.pug file. Go to authcontroller.protect middleware
*/


/*10 Now we will implement fuctionality that the user can update their information,in this case we 
will work with email and password only. So there are two ways of doing it one is we can use html form
another is we can use api(backend). Using html form submit is simple way but has lot of disadvantages.
First is the page will re-render and second it is difficuilt to handle error. So let us stick with
api method. For this we will create updateSetting.js file in the public folder.Let us go into it.

Go to updateSetting.js file in public folder.
*/


module.exports=router