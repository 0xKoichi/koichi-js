const { SlashCommandBuilder } = require("@discordjs/builders");
const musicInit = require("../../components/fun/music/music-handler");

const data = new SlashCommandBuilder()
  .setName("activity")
  .setDescription(
    "Set up activities with your friends! (Must be in Voice Channel)"
  );

module.exports = {
  data,
  execute: musicInit,
};
