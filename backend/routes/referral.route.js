import express from 'express';
import crypto from 'crypto';
import Referral from '../models/referral.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

const router = express.Router();

// Generate referral link
router.post('/generate-link', async (req, res) => {
  const telegramId = req.body.telegramId;

  try {
    if (!telegramId) {
      return res.status(401).json({ message: 'Unauthorized: User data not found' });
    }

    // Find the user in the database
    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique referral code if it doesn't exist
    let referralCode = user.referralCode;
    if (!referralCode) {
      do {
        referralCode = crypto.randomBytes(6).toString('hex');
      } while (await User.findOne({ referralCode }));
      user.referralCode = referralCode;
      await user.save(); // Save the updated user document
    }

    // Return the referral link
    res.json({ referralLink: `https://t.me/tgrefhub_bot/Tgrefhub?start=${referralCode}` });
  } catch (error) {
    console.error('Error generating referral link:', error);
    res.status(500).json({ message: 'Error generating referral link', error: error.message });
  }
});

// Record a new referral
router.post('/record-referral', async (req, res) => {
  const session = await Referral.startSession();
  session.startTransaction();

  try {
    const { referralCode, newUserTelegramId } = req.body;

    // Find the referrer by referral code
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(404).json({ message: 'Invalid referral code' });
    }

    // Find the referred user by their Telegram ID
    const referredUser = await User.findOne({ telegramId: newUserTelegramId });
    if (!referredUser) {
      return res.status(404).json({ message: 'Referred user not found' });
    }

    // Check if the referred user already has a referrer
    if (referredUser.referrer) {
      return res.status(400).json({ message: 'User has already been referred by another user' });
    }

    // Check if a referral already exists between the referrer and referred user
    const existingReferral = await Referral.findOne({
      referrer: referrer._id,
      referred: referredUser._id
    });
    if (existingReferral) {
      return res.status(400).json({ message: 'Referral already exists' });
    }

    // Create a new referral record
    const newReferral = new Referral({
      referrer: referrer._id,
      referred: referredUser._id,
      pointsEarned: 3,
      status: 'completed',
      completedAt: new Date()
    });
    await newReferral.save({ session });

    // Update referrer's points and referrals
    referrer.points += 3;
    referrer.referrals.push(referredUser._id);
    await referrer.save({ session });

    // Update referred user's referrer
    referredUser.referrer = referrer._id;
    await referredUser.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'Referral recorded successfully', referral: newReferral });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error recording referral:', error);
    res.status(500).json({ message: 'Error recording referral', error: error.message });
  }
});

// Get referral stats for a user
router.post('/stats', async (req, res) => {
  try {
    const telegramId = req.body.telegramId;

    if (!telegramId) {
      return res.status(400).json({ message: "Telegram ID is required." });
    }

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const referrals = await Referral.find({ referrer: user._id }).populate('referred', 'firstName');
    const totalReferrals = referrals.length;
    const totalPoints = referrals.reduce((sum, ref) => sum + ref.pointsEarned, 0).toFixed(2);
    const activeUsers = await Referral.countDocuments({ referrer: user._id, status: 'completed' });

    res.json({
      stats: {
        totalReferrals,
        totalPoints,
        activeUsers,
      },
      referrals: referrals.map(ref => ({
        _id: ref._id,
        firstName: ref.referred?.firstName || 'Unknown',
        pointsEarned: ref.pointsEarned.toFixed(2),
        status: ref.status,
        completedAt: ref.completedAt,
      })),
      userPoints: user.points,
    });
  } catch (error) {
    console.error("Error fetching referral stats:", error);
    res.status(500).json({ message: 'Error fetching referral stats', error: error.message });
  }
});

// Update points for task completion
router.post('/update-points', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { telegramId, pointsEarned } = req.body;
    console.log('telegramId:', telegramId, 'pointsEarned:', pointsEarned);
    
    if (isNaN(pointsEarned) || typeof pointsEarned !== 'number') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Invalid points value' });
    }

    const user = await User.findOne({ telegramId }).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If user has a referrer, update referrer's points
    if (user.referrer) {
      const referrerBonus = pointsEarned * 0.1; // 10% bonus
      console.log('Referrer bonus:', referrerBonus);
      const referrer = await User.findByIdAndUpdate(
        user.referrer,
        { $inc: { points: referrerBonus } },
        { new: true, session, runValidators: true }
      );
      
      if (!referrer) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Referrer not found' });
      }
      
      // Update the referral record
      await Referral.findOneAndUpdate(
        { referrer: user.referrer, referred: user._id },
        { $inc: { pointsEarned: referrerBonus } },
        { session, runValidators: true }
      );

      console.log(`Referrer bonus added: ${referrerBonus} points`);
    }

    await session.commitTransaction();
    session.endSession();
    
    res.json({ message: 'Referrer points updated successfully', userPoints: user.points });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error updating referrer points:', error);
    res.status(500).json({ message: 'Error updating referrer points', error: error.message });
  }
});



export default router;
