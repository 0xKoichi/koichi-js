const { SlashCommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!")
  .setDefaultPermission(true);

const execute = async (ctx) => {
  await ctx.reply("Pong!");
};

module.exports = {
  data,
  execute,
};
