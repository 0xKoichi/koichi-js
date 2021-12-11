const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { TOKEN, CLIENT_ID, Bot } = require("../main");
const fs = require("fs/promises");

// Set up the REST api
const rest = new REST({ version: "9" }).setToken(TOKEN);

// Grab commands from the /commands/ folder
const commandSetup = async () => {
  const commands = [];

  try {
    const files = await fs
      .readdir("../commands")
      .filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const command = require(`../commands/${file}`);

      Bot.commands.set(command.data.name, command);

      commands.push(command.data.toJSON());
    }

    return commands;
  } catch (err) {
    console.log(err);
    return err;
  }
};

// Asynchronously call the commandSetup and then post those commands via the API
const deployCommands = async () => {
  commandSetup()
    .then(async (commands) => {
      try {
        rest.put(Routes.applicationCommands(CLIENT_ID), {
          body: commands,
        });
        console.log("Setting up commands...");
        return "Completed";
      } catch (err) {
        console.error(err);
      }
    })
    .catch((err) => console.error(err));
};

module.exports = {
  deployCommands,
};
