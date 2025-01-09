import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Airdrop from './models/listing.model.js'; 
import fetchMetaData from './routes/fetch-metadata.routes.js';
import listingsRouter from './routes/listings.route.js';
import cors from 'cors';
import User from './models/user.model.js';
import userRoutes from './routes/user.route.js';
import referralRoutes from './routes/referral.route.js'; 
import paymentRoutes from './routes/payment.route.js';
import path from 'path';

const router = express.Router();

 
const __dirname = path.resolve();

const app = express();
dotenv.config();
app.use(cors());
 

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Could not connect to MongoDB', error));

const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// API Status Endpoint
app.get('/test', (req, res) => { 
  res.send('API is running');
});

// User Api Endpoint 
app.use('/api/user', userRoutes);

//referrel Api Endpoint

app.use('/api/referrals', referralRoutes);

// Airdrop Creation Endpoint

app.use('/api', fetchMetaData);
app.use('/api/listings', listingsRouter);
app.use('/api/create-invoice', paymentRoutes);




// Serve Frontend Static Files

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, './frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend/dist/index.html'));
  });
} 

// Start the Server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


