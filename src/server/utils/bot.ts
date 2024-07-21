import { Telegraf } from "telegraf";

const config = useRuntimeConfig();

const bot = new Telegraf(config.bot.token);

bot.start((ctx) => console.log(ctx));
bot.catch((err) => console.log(err));

export default bot;
