const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User =  require('../models/User');
const {getToken} = require('../utils/helpers');

      router.post("/register", async(req, res)=>{

      const {name,email, password, username} = req.body


      //check if user with this id exists

      const user = await User.findOne({email:email});

      if(user){
         //already registered
         return res
         .status(403).
         json({error:"USER already registered"});

      }
      //VALID IREQUEST FOR NEW USER

      //step 3:

      const hashedPassword = await bcrypt.hash(password,10);
     

      const newUserData  = 
      {email, password:hashedPassword,name, username};
      const newUser = await User.create(newUserData);

      console.log("\n\n passw: "+newUser.password);

      //s4
      const token = await getToken(email,newUser);

      //s5
      const userToReturn = {...newUser.toJSON(),token}
      delete userToReturn.password;

      return res.status(200).json(userToReturn);

});

  router.post("/login", async (req, res) => {

   const {email,password} = req.body;

    const user = await User.findOne({email: email});

    if(!user){
   return res.status(403).json({error: "🪄User not found"});
    }  

   //  else
   //  return res.status(200).json({message:"going in for password"});

   const isPasswordCorrect = await bcrypt.compare(password,user.password);

    if(!isPasswordCorrect){
     return res.status(403).json({error: "🪄User not found"}); 
   }

         //s4
         const token = await getToken(user.email,user);

         //s5
         const userToReturn = {...user.toJSON(),token}
         delete userToReturn.password;

         return res.status(200).json(userToReturn);

  });

module.exports =router;