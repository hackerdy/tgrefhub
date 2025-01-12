// import { Bot } from "grammy";
// import dotenv from "dotenv";

// dotenv.config();

// const bot = new Bot(process.env.BOT_TOKEN);

// // Map is used for simplicity. For production use a database
// const paidUsers = new Map();

// bot.command("start", (ctx) =>
//   ctx.reply(
//     `Welcome! I am a simple bot that can accept payments via Telegram Stars. The following commands are available:

// /pay - to pay
// /status - to check payment status
// /refund - to refund payment`,
//   ),
// );


// bot.command("pay", (ctx) =>
//   ctx.reply(
//     `purchase points via Telegram Stars. The following payments are available:

// /100 - points
// /500 - points
// /1000 - points`,
//   ),
// );

// bot.command("100", (ctx) => {
//   return ctx.replyWithInvoice("Points", "Purchase 100 points", "{}", "XTR", [
//     { amount: 1, label: "100 points" },
//   ]);
// });


// bot.command("500", (ctx) => {
//   return ctx.replyWithInvoice("Points", "Purchase  500 points", "{}", "XTR", [
//     { amount: 5, label: "500 points" },
//   ]);
// });

// bot.command("1000", (ctx) => {
//   return ctx.replyWithInvoice("Points", "Purchase 1000 points", "{}", "XTR", [
//     { amount: 10, label: "1000 Points" },
//   ]);
// });

// bot.on("pre_checkout_query", (ctx) => {
//   return ctx.answerPreCheckoutQuery(true).catch(() => {
//     console.error("answerPreCheckoutQuery failed");
//   });
// });

// bot.on("message:successful_payment", (ctx) => {
//   if (!ctx.message || !ctx.message.successful_payment || !ctx.from) {
//     return;
//   }

//   paidUsers.set(
//     ctx.from.id,
//     ctx.message.successful_payment.telegram_payment_charge_id,
//   );

//   console.log(ctx.message.successful_payment);
// });

// bot.command("status", (ctx) => {
//   const message = paidUsers.has(ctx.from.id)
//     ? "You have paid"
//     : "You have not paid yet";
//   return ctx.reply(message);
// });

// bot.command("refund", (ctx) => {
//   const userId = ctx.from.id;
//   if (!paidUsers.has(userId)) {
//     return ctx.reply("You have not paid yet, there is nothing to refund");
//   }

//   ctx.api
//     .refundStarPayment(userId, paidUsers.get(userId))
//     .then(() => {
//       paidUsers.delete(userId);
//       return ctx.reply("Refund successful");
//     })
//     .catch(() => ctx.reply("Refund failed"));
// });

// bot.start();