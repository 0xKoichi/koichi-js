const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { TOKEN, APP_ID } = process.env;
const axios = require("axios").default;
const headers = { Authorization: `Bot ${TOKEN}` };

const getCommands = async (guild) => {
  return axios
    .get(
      `https://discord.com/api/v9/applications/${APP_ID}/guilds/${guild}/commands`,
      { headers }
    )
    .then((res) => {
      const commands = [];
      for (const command of res.data) {
        commands.push({ label: command.name, value: command.id });
      }
      return commands;
    })
    .catch((err) => {
      console.log(err);
    });
};

const data = new SlashCommandBuilder()
  .setName("delete")
  .setDescription("Delete a command from the globals/guild")
  .setDefaultPermission(false);

const execute = async (Bot) => {
  // 'Bot' refers to the interaction sent to the bot.

  getCommands(Bot.guild.id)
    .then((commands) => {
      return (row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("delete-menu")
          .setPlaceholder("Select a command...")
          .addOptions(commands)
      ));
    })
    .then(async (row) => {
      await Bot.reply({
        content: "Choose a command to delete",
        components: [row],
        ephemeral: true,
      });
    })
    .catch((err) => {
      return Bot.reply(`${err}`);
    });
};

const changeCommand = async (interaction) => {
  try {
    const deletedCommand = await axios
      .get(
        `https://discord.com/api/v9/applications/${APP_ID}/guilds/${interaction.guild.id}/commands/${interaction.values[0]}`,
        { headers }
      )
      .then((res) => {
        return res.data;
      });
    await axios.delete(
      `https://discord.com/api/v9/applications/${APP_ID}/guilds/${interaction.guild.id}/commands/${interaction.values[0]}`,
      { headers }
    );
    await interaction.update({
      content: `Deleted the ${deletedCommand.name} command`,
      components: [],
      ephemeral: true,
    });
  } catch (err) {
    await interaction.reply(`${err}`);
  }
};

module.exports = {
  data,
  execute,
  changeCommand,
};
