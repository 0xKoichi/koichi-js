const fs = require("fs");
const ytdl = require("ytdl-core");
const Queue = require("./queue");

const musicInit = async (interaction, client) => {
  console.log(interaction);
  await queueHandler(interaction, client);
};

const queueHandler = async (interaction, client) => {
  await stageHandler(interaction, client);
  // if (!client.guildMusic.has(interaction.guildId)) {
  //   client.guildMusic.set()
  // }
};

const guildUpdate = async (interaction) => {
  const guild = await interaction.member.guild.fetch();
  console.log(guild.id);
  guild
    .edit({
      name: "Test guild update",
    })
    .then((updated) => console.log(`New guild ${updated}`))
    .catch(console.error);
};

module.exports = musicInit;
