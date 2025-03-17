// user: hisoka
// password: K25jAtWkja68k0pw

import express from "express";
import cors from "cors";
import {req_data, userModel} from "./model.mjs";
import Campaign from "./campaignModel.mjs";

const app = express();
app.use(express.json());
app.use(cors());

// Create a new campaign
app.post("/campaigns/create", async (req, res) => {
  try {
    const campaignData = req.body;

    // Handle file upload - in a real app, you would use a middleware like multer
    // For now, assuming coverImage is a URL string

    const newCampaign = new Campaign(campaignData);
    const savedCampaign = await newCampaign.save();

    res.status(201).json({
      message: "Campaign created successfully",
      success: true,
      campaignId: savedCampaign._id
    });
  } catch (err) {
    console.error("Error creating campaign:", err);
    res.status(500).json({
      message: "Error creating campaign",
      success: false,
      error: err.message
    });
  }
});

// Get all campaigns
app.get("/campaigns", async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    res.status(500).json({
      message: "Error fetching campaigns",
      success: false,
      error: err.message
    });
  }
});

// Get campaigns by category
app.get("/campaigns/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const campaigns = await Campaign.find({ category: categoryId }).sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (err) {
    console.error("Error fetching campaigns by category:", err);
    res.status(500).json({
      message: "Error fetching campaigns by category",
      success: false,
      error: err.message
    });
  }
});

// Get campaign by ID
app.get("/campaigns/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        message: "Campaign not found",
        success: false
      });
    }
    res.status(200).json(campaign);
  } catch (err) {
    console.error("Error fetching campaign:", err);
    res.status(500).json({
      message: "Error fetching campaign",
      success: false,
      error: err.message
    });
  }
});

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
