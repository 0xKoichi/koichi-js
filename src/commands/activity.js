const { SlashCommandBuilder } = require("@discordjs/builders");
const dotenv = require("dotenv").config();
const { TOKEN, APP_ID } = dotenv.parsed;
const { Routes } = require("discord-api-types/v9");
const { REST } = require("@discordjs/rest");

const activitiesList = {
  youtube: {
    id: "755600276941176913",
    name: "Watch Youtube Together",
  },
};

const data = new SlashCommandBuilder()
  .setName("activity")
  .setDescription("Set up activities with your friends!")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("youtube")
      .setDescription("Start a YouTube party with your friends!")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription(
            "The voice channel you want the party to be hosted in!"
          )
          .setRequired(true)
      )
  );

const execute = async (interaction) => {
  console.log(interaction.options["_hoistedOptions"]);
};

module.exports = {
  data,
  execute,
};
