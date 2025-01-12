import express from 'express';
import { Bot, InlineKeyboard } from 'grammy';
import cors from 'cors';
import paidUsers from '../models/paidUsers.model.js';
import User from '../models/user.model.js';


const bot = new Bot(process.env.BOT_TOKEN);
const router = express.Router();

// Utility: Create Inline Keyboard
const createKeyboard = () => {
  return new InlineKeyboard()
    .url('Open Mini App', 'https://t.me/tgrefhub_bot/Tgrefhub')
    .row()
    .url('Follow on Twitter', 'https://x.com/tgrefhub_backup')
    .row()
    .url('Join Telegram Channel', 'https://t.me/tgrefhub');
};

// Event: New Chat Member
bot.on('my_chat_member', async (ctx) => {
  if (ctx.myChatMember.new_chat_member.status === 'member') {
    await ctx.reply(
      'Welcome to Telegram Referral Hub! Please join our channel and follow us:',
      { reply_markup: createKeyboard() }
    );
  }
});

// Event: Start Command
bot.command('start', async (ctx) => {
  await ctx.reply(
    'Welcome! Please join our Telegram channel and follow us on Twitter:',
    { reply_markup: createKeyboard() }
  );
});

// Event: Payment Handling
bot.on('message', async (ctx) => {
  if (ctx.message.successful_payment) {
    const { successful_payment: payment, from } = ctx.message;
    const { id: telegramId } = from;
    const { telegram_payment_charge_id: paymentId, total_amount: amount } = payment;

    try {
      await new paidUsers({ telegramId, paymentId, amount }).save();
      await User.findOneAndUpdate({ telegramId }, { $inc: { points: amount * 100 } });

      await ctx.reply(`Payment of ${amount} XTR successful! Thank you for your purchase.`);
    } catch (error) {
      console.error('Error handling payment:', error);
      await ctx.reply('Payment received, but there was an error updating records. Please contact support.');
    }
  } else {
    await ctx.reply('Welcome to Telegram Referral Hub! Please join our channel and follow us:', {
      reply_markup: createKeyboard(),
    });
  }
});

// Handle Pre-checkout Query
bot.on('pre_checkout_query', async (ctx) => {
  try {
    await ctx.answerPreCheckoutQuery(true);
  } catch (error) {
    console.error('Failed to answer pre-checkout query:', error);
  }
});

// Start the Bot
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
      [{ label: `${amount} points`, amount: amount * 0.01 }] // prices
    );

    res.json({ payment_url: invoice });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});


export default router;
