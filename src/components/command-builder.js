const dotenv = require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { TOKEN, CLIENT_ID } = dotenv.parsed;
const fs = require("fs/promises");
const path = require("path");
const { adminCommands } = require("../../config/config.json");

// Set up the REST api
const rest = new REST({ version: "9" }).setToken(TOKEN);

// Grab commands from the /commands/ folder
const commandSetup = async (Bot) => {
  const commands = [];

  try {
    const allFiles = await fs.readdir(path.join(__dirname, "../commands"));
    const files = allFiles.filter((file) => file.endsWith(".js"));

    for await (const file of files) {
      const command = require(`../commands/${file}`);

      Bot.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
    }

    console.log(commands, "<--- JSON commands");
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
        await rest
          .put(Routes.applicationGuildCommands(CLIENT_ID, guild.id), {
            body: commands,
          })
          .then(async () => {
            await updateCommands(client, guild, admins);
          });
      } catch (err) {
        console.error(err);
      }
    })
    .catch((err) => console.error(err));
};

const updateCommands = async (client, guild, admins) => {
  guild.commands
    .fetch()
    .then((collection) => {
      collection.forEach((command) => {
        if (adminCommands.includes(command.name)) {
          client.application.commands.permissions
            .set({
              guild: guild.id,
              command: command.id,
              permissions: [...admins],
            })
            .then(console.log)
            .catch(console.log);
        }
      });
    })
    .catch(console.log);
};
module.exports = {
  deployCommands,
};
