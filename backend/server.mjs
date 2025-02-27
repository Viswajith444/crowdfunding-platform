// user: hisoka
// password: K25jAtWkja68k0pw

import express from "express";
import cors from "cors";
// import mongoose from "mongoose"
import {req_data, userModel} from "./model.mjs";

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB

// Define a sample API route
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.get("/lol", (_, res) =>{
    res.send("😁😁😁😁");
})

app.post("/:id", async (req, res)=>{
  const {id} = req.params;
  const itsjson = req.body;



  console.log(id);
  console.log(itsjson);
  let x = await req_data.find(itsjson);
  console.log(x);
  res.status(200).send(x);
})

app.post("/userInfos/add", async(req, res) =>{
  const userInfo = req.body;

  console.log(userInfo);
  // let [user, password] = [userInfo.username, userInfo.password];

  let a = userModel.findOne({username: userInfo.username})

  if(Object.entries(a).length !== 0){

    res.status(201) // ok ig but not good
        .send({message:"Username already exists", exists: true});
    return;
  }

  let newUser = new userModel(userInfo);
  let x = await newUser.save();

  console.log("Save document:" + x);

  res.status(200).json({message: "Valid"})

})

app.post("/userInfos/chk", async(req, res) =>{
  const userInfo = req.body;

  console.log(userInfo);
  let a = await userModel.findOne({username: userInfo.username})
  console.log("hello");
  console.log(a);

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
  else{
    res.status(202).json({message:`Username "${userInfo.username}" does not exists`, login: false});
    console.log("idk error");
  }

})


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
