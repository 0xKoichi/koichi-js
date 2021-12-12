const dotenv = require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { TOKEN, CLIENT_ID } = dotenv.parsed;
const fs = require("fs/promises");
const path = require("path");

// Set up the REST api
const rest = new REST({ version: "9" }).setToken(TOKEN);

// Grab commands from the /commands/ folder
const commandSetup = async (Bot, admins) => {
  const commands = [];

  try {
    const allFiles = await fs.readdir(path.join(__dirname, "../commands"));
    const files = await allFiles.filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const command = require(`../commands/${file}`);

      if (command.data.name === "delete") {
        command.data.permissions = admins;
      }
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
const deployCommands = async (client, guild, admins) => {
  return commandSetup(client, admins)
    .then(async (commands) => {
      try {
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guild.id), {
          body: commands,
        });
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
