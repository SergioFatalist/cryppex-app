import { Telegraf } from "telegraf";

const config = useRuntimeConfig();

const bot = new Telegraf(config.botToken);

bot.start((ctx) => console.log(ctx));
bot.catch((err) => console.log(err));
bot.on("channel_chat_created", (ctx) => console.log(ctx));

export default bot;
