const { SlashCommandBuilder } = require("@discordjs/builders");
const musicInit = require("../../components/fun/music/music-handler");

const data = new SlashCommandBuilder()
  .setName("music")
  .setDescription("Start streaming music!");

module.exports = {
  data,
  execute: musicInit,
};
