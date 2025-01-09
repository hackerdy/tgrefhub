import express from 'express';
import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';
import Airdrop from '../models/airdrop.model.js';
import skipped from '../models/skipped.model.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// POST route to create a new listing
router.post('/', async (req, res) => {
    const { url, points, title, description, image, telegramUsername, telegramId } = req.body;

    // Improved validation: More specific and helpful error messages
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    if (!points) {
        return res.status(400).json({ error: 'Points are required' });
    }
    if (!telegramId) {
        return res.status(400).json({ error: 'Telegram ID is required' });
    }
    if (isNaN(points)) { // Check if points is a valid number
        return res.status(400).json({ error: 'Points must be a number' });
    }
 


    try {
        // Create a new listing object – No need to convert points to Number; Mongoose should handle it based on the schema
        const newListing = new Listing({
            url,
            points, 
            title,       // These are already handled as optional by the schema
            description, 
            image,       
            telegramUsername,
            telegramId,
        });


        // The createdAt field should ideally be handled automatically by Mongoose.
        // Add timestamps: true to your schema options.

        const savedListing = await newListing.save();

        const userId = telegramId; // Assuming you have user authentication middleware that sets req.user

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const user = await User.findOne({ telegramId: userId });  // Find the user by ID

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.points < points) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        user.points -= points;

        user.listings.push(savedListing._id); // Add the listing to the user's listings

        await user.save(); // Save the updated user balance

        // Placeholder user balance logic (replace with your actual implementation)
        // Ensure you handle the Number conversion safely:



    res.status(201).json({ 
    success: true, 
    message: 'Listing created successfully',
    listing: savedListing, 
    newBalance: user.points 
});

    } catch (error) {
        console.error('Error creating listing:', error);

        // More robust error handling:
        if (error.name === 'ValidationError') {  // Mongoose validation error
            return res.status(400).json({ error: error.message }); // Send the specific validation error
        }
        res.status(500).json({ error: 'Failed to create listing' });
    }
});


router.get('/', async (req, res) => {
    const { telegramId } = req.query;

    if (!telegramId) {
        return res.status(400).json({ error: 'Telegram ID is required' });
    }

    try {
        const listings = await Listing.find({ telegramId })
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            

        res.json(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});



router.get('/available', async (req, res) => {
    try {
        const { telegramId } = req.query;

        if (!telegramId) {
            return res.status(400).json({ message: 'telegramId is required' });
        }

        const user = await User.findOne({ telegramId }).populate('listings');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch joined airdrops
        const joinedAirdrops = await Airdrop.find({ user: user._id }).populate('listing');

        // Fetch skipped listings
        const skippedListings = await skipped.find({ user: user._id }).distinct('listing');

        const excludedIds = [
            ...joinedAirdrops.map(airdrop => airdrop.listing._id.toString()),
            ...user.listings.map(listing => listing._id.toString()),
            ...skippedListings
        ];

        const excludedUsernames = [
            ...joinedAirdrops.map(airdrop => airdrop.listing.telegramUsername),
            ...user.listings.map(listing => listing.telegramUsername)
        ].filter(Boolean);

        const availableListings = await Listing.find({
            _id: { $nin: excludedIds },
            telegramUsername: { $nin: excludedUsernames },
            telegramId: { $ne: telegramId },
            $expr: { $gt: ["$points", "$progress"] }
        });

        res.json(availableListings);
    } catch (error) {
        console.error('Error fetching available listings:', error);
        res.status(500).json({ message: 'Failed to fetch available listings', error: error.message });
    }
});


router.post('/start', async (req, res) => {
    try {
      const { telegramId, listingId } = req.body;
  
      // Find the user
      const user = await User.findOne({ telegramId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the listing
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
  
      // Check if user has already joined this airdrop
      if (user.joinedAirdrops.includes(listingId)) {
        return res.status(400).json({ message: 'You have already joined this airdrop' });
      }
  
      // Create a new Airdrop document
      const newAirdrop = new Airdrop({
        listing: listing._id,
        user: user._id,
        points: 1,
        status: 'started'
      });
      await newAirdrop.save();
  
      // Add the listing to the user's joinedAirdrops and increment points
      user.joinedAirdrops.push(listingId);
      user.points = (user.points || 0) + 1;
      await user.save();
  
      // Update the listing
      listing.progress = Math.min(listing.progress + 1, listing.points);
      listing.completedBy.push(telegramId);
  
      // Check if the listing is completed
      if (listing.progress >= listing.points) {
        listing.completed = true;
      }
  
      await listing.save();
  
      res.json({ 
        message: 'Task started successfully', 
        user: { 
          telegramId: user.telegramId, 
          points: user.points, 
          pointsEarned: Number(1),
        }, 
        listing: {
          _id: listing._id,
          progress: listing.progress,
          completed: listing.completed
        },
        airdrop: newAirdrop
      });
    } catch (error) {
      console.error('Error starting task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.get('/joined-airdrops', async (req, res) => {
    try {
      const { telegramId } = req.query;
    console.log(telegramId);
      if (!telegramId) {
        return res.status(400).json({ message: 'telegramId is required' });
      }
   
      const user = await User.findOne({ telegramId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const joinedAirdrops = await Airdrop.find({ user: user._id })
        .populate('listing', 'title description points progress')
        .select('-user');
  
      res.json(joinedAirdrops);
    } catch (error) {
      console.error('Error fetching joined airdrops:', error);
      res.status(500).json({ message: 'Failed to fetch joined airdrops', error: error.message });
    }
  });
  
  
  
  

export default router;