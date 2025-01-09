import mongoose from 'mongoose';

const paiduserSchema = new mongoose.Schema(
    {
        telegramId: String,
        paymentId: String,
        amount: Number,
    },
    {
        timestamps: true
    },
);

const paidUsers = mongoose.model('paidUsers', paiduserSchema);

export default paidUsers;