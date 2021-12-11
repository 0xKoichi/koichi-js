const dotenv = require("dotenv").config();
const { TOKEN, CLIENT_ID } = dotenv.parsed;
const {
  botSettings: { bitfieldIntents },
} = require("../config/config.json");
const { Client, Intents, Collection } = require("discord.js");
const intents = new Intents(...bitfieldIntents);
const fs = require("fs");

const Bot = new Client({ intents });
Bot.commands = new Collection();

const eventFiles = fs
  .readdirSync(__dirname + "/events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    Bot.once(event.name, (...args) => event.execute(...args));
  } else {
    Bot.on(event.name, (...args) => event.execute(...args));
  }
}

Bot.login(TOKEN);

module.exports = {};
