const mongoose = require('mongoose')
const bookModel = require("../models/bookmodel")
const reviewModel = require("../models/reviewmodel");
const userModel= require("../models/usermodel")
const jwt = require("jsonwebtoken")
const { valid, regForName, regForDate } = require('../validation/validation');
function validateEmail(input) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(input);
}

function validmobile(input){
  var mobile=input;
  if(mobile.length!=10){
      return false;
      
  }
  intRegex = /[0-9 -()+]+$/;
  var is_mobile=true;
  for ( var i=0; i < 10; i++) {
      if(intRegex.test(mobile[i]))
      { 
          continue;
      }
      else{
          is_mobile=false;
          break;
      }
  }
  return is_mobile;
}


const createUser = async function (req, res) {
    try {
      let user = req.body
      if (Object.keys(user).length == 0) return res.status(400).send({ status: false, msg: "data is not present" })
      let title = req.body.title
      let name = req.body.name
      let phone = req.body.phone
      let email = req.body.email
      let password = req.body.password
      let address = req.body.address
  
  
  
      if (!title) {
        return res.status(400).send({ status: false, msg: "Title is mandatory" })
      }
      if (!["Mr", "Mrs", "Miss"].includes(title)) {
        return res.status(400).send({ status: false, msg: "title is not valid" })
      }
      if (!name) {
        return res.status(400).send({ status: false, msg: "Name field is required" })
      }
      if (valid(name) == false) {
        return res.status(400).send({ status: false, msg: "Name is not valid" })
      }
      if (!phone) { return res.status(400).send({ status: false, msg: "Phone no. is mandatory" }) }
  
      if (valid(phone) === false) {
        return res.status(400).send({ status: false, msg: "Phone is not valid" })
      }
      if(validmobile(phone)===false){
        return res.status(400).send({ status: false, msg: "Phone is not valid" })}
  
      if (!email) { return res.status(400).send({ status: false, msg: "Email Id is mandatory" }) }
      if (valid(email) === false) {
        return res.status(400).send({ status: false, msg: "Email is not valid" })
      }
      
      if (validateEmail(email) == false) { return res.status(400).send({ status: false, msg: "email format is invalid" }) }
  
      let uniqueEmail = await userModel.findOne({ email: email })
      if (uniqueEmail) { return res.status(404).send({ status: false, msg: "Email id Already exists" }) }
  
      if (!password) {
        return res.status(400).send({ status: false, msg: "Password is mandatory" })
      }
      if (valid(password) === false) {
        return res.status(400).send({ status: false, msg: "Password is not valid" })
      }
      if (!(password.length > 8) || (!(password.length < 15))) {
        return res.status(400).send({ status: false, msg: "Password must be between 8 to 15 Characters" })
      }
      if(address){
        if(typeof address!= "object"){
          return res.status(400).send({status:false, message:"Address should be in object!"})
        }
        else {
          let userCreated = await userModel.create(user);
          return res.status(201).send({ status: true, data: userCreated })
        }
        
      }else {
        let userCreated = await userModel.create(user);
        return res.status(201).send({ status: true, data: userCreated })
      }
      
      
    }
    catch (err) {
      return res.status(500).send({ status: false, msg: err.message })
  }
  }
  

const loginUser = async function (req, res) {
    try {
      let emailId = req.body.email;
      if (!(emailId)) {
        return res.status(400).send({ status: false, msg: "Email Id  is mandatory for login" })
      }
      if(validateEmail(emailId)==false){
        return res.status(400).send({status:false, message:"Invalid email Format"})
      }
      let password = req.body.password;
      if (!(password)) {
        return res.status(400).send({ status: false, msg: " Password is mandatory for login" })
      }
      
  
      let user = await userModel.findOne({ email: emailId, password: password });
      if (!user) { return res.status(404).send({ status: false, msg: "User not found with this EmailId and Password", }) }
  
      let token = jwt.sign(                   
        {
          userId: user._id.toString(),
          userName: emailId,
          password: password
  
        },
        "room-35-secret-key",{expiresIn:"1hr"}
      );
      res.setHeader("x-api-key", token);
      return res.status(200).send({ status: true, data: token });
    } catch (Err) {
      return res.status(500).send({ status: false, msg: Err.message });
    }
  };

  module.exports= {loginUser, createUser}