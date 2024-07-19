import { Telegraf } from "telegraf";

const config = useRuntimeConfig();

const bot = new Telegraf(config.botToken);

bot.start((ctx) => console.log(ctx));
bot.catch((err) => console.log(err));

export default bot;
