import mongoose from "mongoose";

// Create a campaign schema
const rewardSchema = new mongoose.Schema({
  title: String,
  description: String,
  amount: Number,
  deliveryDate: Date
});

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,  // URL or path to image
    required: true
  },
  story: {
    type: String,
    required: true
  },
  rewards: [rewardSchema],
  backers: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create connection for campaigns database
const campaignHandle = mongoose.createConnection(process.env.MONGO_URI + "campaignsDatabase");

// Event listeners for connection status
campaignHandle.on('connected', () => {
  console.log('Mongoose connected to the campaigns database');
});

campaignHandle.on('error', (err) => {
  console.error('Mongoose campaign connection error:', err);
});

campaignHandle.on('disconnected', () => {
  console.log('Mongoose disconnected from the campaigns database');
});

// Create the model
const Campaign = campaignHandle.model("Campaign", campaignSchema, "campaigns");

export default Campaign;