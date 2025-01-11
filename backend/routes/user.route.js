import express from 'express';
import crypto from 'crypto';
import { parse } from 'querystring'; // Import querystring
import User from '../models/user.model.js';
import dotenv from 'dotenv';
const router = express.Router();
dotenv.config();
import Listing from '../models/listing.model.js';


// Telegram Bot Token (Replace with your bot token)
const BOT_TOKEN = process.env.BOT_TOKEN;


async function validateTelegramData(req, res) {
  try {
    const initData = req.body.initData;
    if (!initData) {
      return res.status(400).json({ error: 'initData is required' });
    } 
    const parsedInitData = new URLSearchParams(initData);
    const hash = parsedInitData.get('hash');
    parsedInitData.delete('hash');

    // Sort keys manually
    const sortedKeys = Array.from(parsedInitData.keys()).sort();
    let dataCheckString = '';
    for (const key of sortedKeys) {
      dataCheckString += `${key}=${parsedInitData.get(key)}\n`;
    }
    dataCheckString = dataCheckString.slice(0, -1);

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (calculatedHash !== hash) {
      return res.status(400).json({ error: 'Invalid initData hash' });
    }

    const MAX_AUTH_AGE = 24 * 60 * 60; // 24 hours in seconds
const WARN_AUTH_AGE = 23 * 60 * 60; // 23 hours in seconds

const authDate = parseInt(parsedInitData.get('auth_date'), 10);
const currentTime = Math.floor(Date.now() / 1000);
const authAge = currentTime - authDate;

if (authAge > MAX_AUTH_AGE) {
  return res.status(401).json({
    error: 'Authentication Expired',
    message: 'Your session has expired. Please restart the app.',
    code: 'AUTH_EXPIRED'
  });
} else if (authAge > WARN_AUTH_AGE) {
  console.warn(`Auth data nearing expiration. Age: ${authAge} seconds`);
  // Optionally, you can add a warning to the response
  res.set('X-Auth-Expiring-Soon', 'true');
}

// If we reach here, the auth is still valid
console.log(`Auth age: ${authAge} seconds`);


    const userObj = JSON.parse(parsedInitData.get('user'));
    if (userObj.is_bot) {
      return res.status(400).json({ error: 'Bots are not allowed' });
    } 

    const telegramId = userObj.id;
    const isPremium = userObj.is_premium;


    try {
      let user = await User.findOne({telegramId});

      if (!user) {
        user = new User({
          telegramId: telegramId,
          premium: isPremium || false,
          points: isPremium ? 2 : 0,
          firstName: userObj.first_name,
        });
      } else {
        if (!user.premium && isPremium) {
          user.premium = isPremium;
          user.points += 2;
        }
      }

      await user.save();
       // Create a response object with user data
    const responseData = {
      message: 'User created/updated successfully',
      user: {
        telegramId: user.telegramId,
        premium: user.premium,
        points: user.points.toFixed(2),
        firstName: userObj.first_name,
        lastName: userObj.last_name,
        username: userObj.username,
        photoUrl: userObj.photo_url
      }
    };

    return res.json(responseData);
      return res.json({ message: 'User created/updated successfully', user });
    } catch (dbError) {
      console.error('Database error while saving user:', dbError);
      return res.status(500).json({ error: 'Database error', details: dbError.message });
    }
  } catch (error) {
    console.error('Error validating Telegram data:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

import Skipped from '../models/skipped.model.js';

router.post('/skip', async (req, res) => {
  try {
    const { telegramId, listingId } = req.body;

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if already skipped
    const existingSkip = await Skipped.findOne({ user: user._id, listing: listing._id });
    if (existingSkip) {
      return res.status(400).json({ message: 'Task already skipped' });
    }

    // Create new Skipped document
    const newSkip = new Skipped({
      user: user._id,
      listing: listing._id
    });
    await newSkip.save();

    // Add to user's skipped array if you want to keep this functionality
    user.skipped.addToSet(listingId);
    await user.save();

    res.json({ message: 'Task skipped successfully', skip: newSkip });
  } catch (error) {
    console.error('Error skipping task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/validate-telegram-data', validateTelegramData); // Associate the handler with the route

export default router; // Export the router