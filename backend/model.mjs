import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// mongoose
// // .connect("mongodb://localhost:27017/sjit")
// .connect(process.env.MONGO_URI + "sample_mflix")
// .then(() => console.log("MongoDB Connected"))
// .catch((err) => console.error(err));

// <------- Deepseek ----------------->


const userHandle = mongoose.createConnection(process.env.MONGO_URI + "userInfosDatabase");

// Get the default connection

// Event listeners for connection status
userHandle.on('connected', () => {
  console.log('Mongoose connected to the database');
});

userHandle.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

userHandle.on('disconnected', () => {
  console.log('Mongoose disconnected from the database');
});

// Optional: Close the connection when the Node process ends
process.on('SIGINT', () => {
  userHandle.close(() => {
    console.log('Mongoose connection closed due to application termination');
    process.exit(0);
  });
});

// <------- Deepseek ----------------->





let schema = new mongoose.Schema({
    name: String,
    age : Number,
  })

let userModelSchema = new mongoose.Schema(
  {
    username: String,
    password: String, //TODO hash it
  }
)

const req_data = new mongoose.model("Theaters", schema, "theaters");

const userModel = userHandle.model("UserInfo", userModelSchema, "userInfos");

export {req_data, userModel};