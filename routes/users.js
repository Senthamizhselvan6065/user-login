var express = require("express");
var router = express.Router();

/** MONGODB CONECTION */
const { dbUrl } = require("../common/dbConfig");
const { userModel } = require("../schemas/userSchema");
const { default: mongoose } = require("mongoose");
mongoose.connect(dbUrl)

/** hashPassword hashCompare function import **/
const { hashPassword, hashCompare, createToken, validate, roleAdmin } = require("../common/auth");


/**
    GET ALL USERS
      Path = localhost:3000/users
      Method = get
*/
/** Validate  **/
router.get("/", validate, roleAdmin, async(req, res) => {
     try {
      /** get all users using the find method  */
      let user = await userModel.find()
        if(user){
           res.status(200).send({
              message: "Users Data Fetch Successfully...",
              user
           })
        }else{
          res.status(400).send({
            message: "Not Get All User..."
         })
        }
     } catch (error) {
        res.status(500).send({
           message: "Internal Server Error",
           error
        })
     }
});


/**
    POST or CREATE a USER
      PATH = localhost:3000/users/signup
      METHOD = post
 */
router.post("/signup",async(req, res, next) => {
     try {
      /** The req.body.email find the userModel object not email execute a if condition **/
      let user = await userModel.findOne({email: req.body.email})

      /** Not a user the if condition is executed **/
        if(!user){

           /** The req.body.password is passed as argument in hashPassword Function **/
             let hashedPassword = await hashPassword(req.body.password)
             req.body.password = hashedPassword;
             
          /** The create method is create a new user name, email and password **/   
            let user = await userModel.create(req.body)
            res.status(201).send({
               message: "User Signup Successfully...",
               user
            })
        }
        /** find the user and the else condition is executed **/
        else{
           res.status(400).send({
              message: "User Already Exists..."
           })
        }
     } catch (error) {
        res.status(500).send({
           message: "Internal Server Error",
           error
        })
     }
});

/** -------------------------------------------------------------------------------------------------------- */

/**
   POST LOGIN 
      PATH : localhost:3000/users/login
      METHOD = post    
**/
router.post("/login",async(req, res, next) => {
   try {

      /** Get a data **/
     let user = await userModel.findOne({email: req.body.email})
     //  console.log('USER-PASSWORD', user.password); 

      /** The user email find and the if condition is executed **/ 
      if(user){
         /** Compare the Password in req.body.password and user object user.password  **/
         /** The hashCompare function passed as argument in req..body.password and user.password **/
           if(await hashCompare(req.body.password, user.password)){
               // console.log('req-password', req.body.password);

               let token = await createToken({
                  name: user.name,
                  email: user.email,
                  id: user._id,
                  role: user.role
               })
            res.status(201).send({
               message: "User Login Successfully...",
               user,
               token
            })
           }else{
              res.status(402).send({
                  message: "Invalid Credent..."
              })
           }
      }
      else{
         res.status(400).send({
            message: "User Does Not Exists..."
         })
      }
   } catch (error) {
      res.status(500).send({
         message: "Internal Server Error",
         error
      })
   }
});

/** -------------------------------------------------------------------------------------------------------- */


/** 
    GET A SINGLE USER
      PATH = localhost:3000/users/:id 
      METHOD = get a single user
**/
router.get("/:id", async(req, res, next) => {
   try {
      /** The get a user id **/
    let user = await userModel.findOne({_id: req.params.id})
      if(user){
         res.status(200).send({
            message: "Get a Single User...",
            user
         })
      }else{
        res.status(400).send({
          message: "Not Get a User..."
       })
      }
   } catch (error) {
      res.status(500).send({
         message: "Internal Server Error",
         error
      })
   }
 });

/** -------------------------------------------------------------------------------------------------------- */


/** 
   DELETE A USER
   PATH = localhost:3000/users/:id 
   METHOD =  Delete a user 
**/
router.delete("/:id", async(req, res, next) => {
   try {
      /** The deleteOne method get a user id deleteing a user **/
    let user = await userModel.deleteOne({_id: req.params.id})
      if(user){
         res.status(200).send({
            message: "User Deleted Successfully...",
            user
         })
      }else{
        res.status(400).send({
          message: "Not Deleteing a User..."
       })
      }
   } catch (error) {
      res.status(500).send({
         message: "Internal Server Error",
         error
      })
   }
});

/** -------------------------------------------------------------------------------------------------------- */


/**
    PUT or UPDATE 
       PATH = localhost:3000/users/:id 
       METHOD = put
**/
router.put("/:id", async(req, res, next) => {
   try {
      /** The get a user id and update the user **/
           let user = await userModel.findOne({_id: req.params.id})

       /** find the user data the if condition is execute **/
      if(user){
         /** Update the user data **/
          user.name = req.body.name
          user.email = req.body.email
          user.password = req.body.password
          
          /** save() method and update the user data **/
          await user.save()
         res.status(200).send({
            message: "User Data Updated Successfully...",
            user
         })
      }else{
        res.status(400).send({
          message: "f.."
       })
      }
   } catch (error) {
      res.status(500).send({
         message: "Internal Server Error",
         error
      })
   }
});


module.exports = router;