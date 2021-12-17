const dotenv = require("dotenv").config();
const { TOKEN } = process.env;
const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");
const Bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INVITES,
  ],
});

Bot.commands = new Collection();
Bot.guildMusic = new Collection();

const eventFiles = fs
  .readdirSync(__dirname + "/events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    Bot.once(event.name, (...args) => event.execute(...args));
  } else {
    Bot.on(event.name, (...args) => event.execute(Bot, ...args));
  }
}

Bot.login(TOKEN);

module.exports = {};
