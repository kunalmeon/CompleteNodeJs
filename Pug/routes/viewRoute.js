const express=require('express')
const viewController=require('../controller/viewController')
const router=express.Router();

router.get('/',viewController.overview)
router.get('/tour/:slug',viewController.getTour);
router.get('/login',viewController.logIn)

module.exports=router