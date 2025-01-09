import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    telegramId: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
      min: [0, 'Points cannot be negative'], // Validate points are non-negative
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    premium: {
      type: Boolean,
      default: false, // Default to non-premium users
    },
    joinedAirdrops: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Airdrop',
    }, {
      telegramUsername: String,
    }],
    listings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
    }],
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    referrals: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    skipped: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skipped',
    }],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const User = mongoose.model('User', userSchema); 

export default User;
