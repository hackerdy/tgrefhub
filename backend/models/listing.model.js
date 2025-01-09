import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    url: String,
    title: String,
    description: String,
    image: String,
    points: Number,
    userId: mongoose.Schema.Types.ObjectId, 
    listingid: String, 
    telegramUsername: String,
    telegramId: String,
    completed: { type: Boolean, default: false },
    completedBy: [{ type: String }], 
    progress: { type: Number, default: 0 },
}, { timestamps: true 
});

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;