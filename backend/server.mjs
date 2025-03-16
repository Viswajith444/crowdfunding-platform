// user: hisoka
// password: K25jAtWkja68k0pw

import express from "express";
import cors from "cors";
import {req_data, userModel} from "./model.mjs";

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB

// Define a sample API route
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});


app.post("/userInfos/add", async(req, res) =>{
  const userInfo = req.body;

  if(userInfo.username === ""){
    return;
  }
  console.log(userInfo);



  try{

      let a = await userModel.findOne({username: userInfo.username})

      if(a !== null){
          res.status(201) // ok ig, but not good
          .json({message:`Username '${userInfo.username}' taken`, success: false});
          return;
        }

        console.log(userInfo.password, userInfo.username);//debug

        if(userInfo.password && userInfo.username){

            let newUser = new userModel(userInfo);
            let x = await newUser.save();

            console.log("Saved document:" + x);

            res.status(200)
            .json({message: "New user account created", success: true})
            return;
        }
    }
     catch(err){
         res.status(400).json({message: "Error", success: false})
        console.log(err);
     }
})



app.post("/userInfos/chk", async(req, res) =>{
  const userInfo = req.body;

  let a = await userModel.findOne({username: userInfo.username})

  if(a === null){

    res.status(202).json({message:`Username ${userInfo.username} does not exists`})
    return;
  }

  if(a.username === userInfo.username && a.password === userInfo.password){
    res.status(200).json({message: "Login Successful", login: true})
    console.log("Login Successful");

  }
  else if(a.username === userInfo.username && a.password !== userInfo.password){
    res.status(201).json({message: "Incorrect password", login: false})
    console.log("Incorrect Password");
  }

  // could remove this 👇
  else{
    res.status(202).json({message:`Username "${userInfo.username}" does not exists`, login: false});
    console.log("idk error");
  }

})





const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
