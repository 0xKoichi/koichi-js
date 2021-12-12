const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const dotenv = require("dotenv").config();
const { TOKEN, APP_ID } = dotenv.parsed;
const axios = require("axios").default;

const getCommands = async (guild) => {
  return axios
    .get(
      `https://discord.com/api/v9/applications/${APP_ID}/guilds/${guild}/commands`,
      {
        headers: {
          Authorization: `Bot ${TOKEN}`,
        },
      }
    )
    .then((res) => {
      const commands = [];
      for (const command of res.data) {
        console.log(command, "<-- command", command.name, "<--label");
        commands.push({ label: command.name, value: command.id });
      }
      console.log(commands);
      return commands;
    })
    .catch((err) => {
      console.log(err);
    });
};

const data = new SlashCommandBuilder()
  .setName("delete")
  .setDescription("Delete a command from the globals/guild")
  .setDefaultPermission(true);

const execute = async (Bot) => {
  getCommands(Bot.guild.id)
    .then((commands) => {
      return (row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("delete-menu")
          .setPlaceholder("Select a command...")
          .addOptions(commands)
      ));
    })
    .then((row) => {
      return Bot.reply({
        content: "Choose a command to delete",
        components: [row],
      });
    })
    .catch((err) => {
      return Bot.reply(`${err}`);
    });
};

const changeCommand = async (interaction) => {
  try {
    await axios.delete(
      `https://discord.com/api/v9/applications/${APP_ID}/guilds/${interaction.guild.id}/commands/${interaction.values[0]}`,
      {
        headers: {
          Authorization: `Bot ${TOKEN}`,
        },
      }
    );
    await interaction.delete(interaction.message);
    await interaction.reply(`${interaction.label} deleted.`);
  } catch (err) {
    await interaction.reply(`${err}`);
  }
};

module.exports = {
  data,
  execute,
  changeCommand,
};
