const { SlashCommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

const execute = async (ctx) => {
  await ctx.reply("Pong!");
};

module.exports = {
  data,
  execute,
};
