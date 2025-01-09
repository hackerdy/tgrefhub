import mongoose from "mongoose";



const skippedSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ['idle', 'skipped', 'completed'],
        default: 'skipped',
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

const Skipped = mongoose.model('Skipped', skippedSchema);

export default Skipped;