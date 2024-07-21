export default defineNitroPlugin(() => {
  console.log("STARTUP:", process.env.NODE_ENV);
  bot.launch().then(() => console.log("BOT: stated"));
  investor.launch().then(() => console.log("INVESTOR: stated"));
});
