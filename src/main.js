const dotenv = require("dotenv").config();
const { TOKEN, CLIENT_ID } = dotenv.parsed;
const {
  botSettings: { bitfieldIntents },
} = require("../config/config.json");
const { Client, Intents, Collection } = require("discord.js");
const { deployCommands } = require("./components/command-builder");
const intents = new Intents(...bitfieldIntents);

const Bot = new Client({
  intents,
});

Bot.commands = new Collection();

Bot.once("ready", (ctx) => {
  console.log(`Bot initialised! Logged in as ${ctx.user.tag}`);

  deployCommands()
    .then((status) => {
      console.log(`Command deployment status: ${status}`);
    })
    .catch((err) => console.error(err));
});

Bot.login(TOKEN);

module.exports = {
  Bot,
  TOKEN,
  CLIENT_ID,
};
