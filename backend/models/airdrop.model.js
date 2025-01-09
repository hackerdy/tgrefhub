import mongoose from "mongoose";

const airdropSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    points: {
        type: Number,
        required: true,
        min: [0, 'Points cannot be negative'], // Validate points are non-negative
    },
    status: {
        type: String,
        enum: ['idle', 'started', 'completed'],
        default: 'idle',
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

const Airdrop = mongoose.model('Airdrop', airdropSchema);

export default Airdrop;
