import express from 'express';
import { Bot, InlineKeyboard } from 'grammy';
import cors from 'cors';
import paidUsers from '../models/paidUsers.model.js';
import User from '../models/user.model.js';


const bot = new Bot(process.env.BOT_TOKEN);
const router = express.Router();

bot.on("my_chat_member", async (ctx) => {
  if (ctx.myChatMember.new_chat_member.status === "member") {
    const keyboard = new InlineKeyboard()
    .url('Open Mini App', 'https://t.me/tgrefhub_bot/Tgrefhub')
    .row()
    .url('Follow on Twitter', 'https://x.com/tgrefhub_backup')
    .row()
    .url('Join Telegram Channel', 'https://t.me/tgrefhub');

    await ctx.reply('Welcome to Telegram Referral Hub! Please join our channel and follow us:', {
      reply_markup: keyboard,
    });
  }
});

bot.on("message", async (ctx) => {
  // Skip if it's a payment message
  if (!ctx.message.successful_payment) {
    const keyboard = new InlineKeyboard()
      .url('Open Mini App', 'https://t.me/tgrefhub_bot/Tgrefhub')
      .row()
      .url('Follow on Twitter', 'https://x.com/tgrefhub_backup')
      .row()
      .url('Join Telegram Channel', 'https://t.me/tgrefhub');

    await ctx.reply('Welcome to Telegram Referral Hub! Please join our channel and follow us:', {
      reply_markup: keyboard,
    });
  }
});

bot.command('start', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .url('Open Mini App', 'https://t.me/tgrefhub_bot/Tgrefhub')
    .row()
    .url('Follow on Twitter', 'https://x.com/tgrefhub_backup')
    .row()
    .url('Join Telegram Channel', 'https://t.me/tgrefhub');

  await ctx.reply('Welcome! Please join our Telegram channel and follow us on Twitter:', {
    reply_markup: keyboard,
  });
});


// Telegram bot handling
bot.on('pre_checkout_query', async (ctx) => {
  try {
    await ctx.answerPreCheckoutQuery(true);
  } catch (error) {
    console.error('Failed to answer pre-checkout query:', error);
  }
});

bot.on("message", async (ctx) => {
  if (ctx.message.successful_payment) {
    const successfulPayment = ctx.message.successful_payment;
    console.log("Payment successful:", successfulPayment);

    const telegramId = ctx.from.id;
    const paymentId = successfulPayment.telegram_payment_charge_id;
    const amount = successfulPayment.total_amount;

    try {
      const newPaidUser = new paidUsers({
        telegramId: telegramId,
        paymentId: paymentId,
        amount: amount
      });
    
      await newPaidUser.save();

      const user = await User.findOneAndUpdate(
        { telegramId: telegramId },
        { $inc: { points: amount * 100 } }, // Increment points by the amount paid
      );

    
      // Notify the user
      await ctx.reply(`Payment of ${amount} XTR successful! Thank you for your purchase.`);
    } catch (error) {
      console.error('Error saving payment:', error);
      await ctx.reply('Payment received, but there was an error updating our records. Please contact support.');
    }
  }
});


// Start the bot
bot.start();

router.post('/', async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    const invoice = await bot.api.createInvoiceLink(
      `Top up ${amount} points`, // title
      `Add ${amount} points to your account`, // description
      "{}", // payload
      "", // provider_token (empty for Telegram Stars)
      "XTR", // currency
      [{ label: `${amount} points`, amount: amount * 0.5 }] // prices
    );

    res.json({ payment_url: invoice });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});


export default router;
