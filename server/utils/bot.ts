import TelegramBot from "node-telegram-bot-api";

const config = useRuntimeConfig();

const bot = new TelegramBot(config.botToken, { polling: true });

bot.onText(/\/echo (.+)/, async (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match ? match[1] : "fooooo";

  // send back the matched "whatever" to the chat
  await bot.sendMessage(chatId, resp);
});

export default bot;
