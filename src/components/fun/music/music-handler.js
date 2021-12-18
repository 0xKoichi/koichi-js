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

const stageHandler = async (interaction, client) => {
  const guild = await interaction.member.guild.fetch();
  const member = await guild.members.fetch(interaction.user.id);

  if (!guild.features.includes("COMMUNITY")) {
    guild
      .edit({
        features: ["COMMUNITY"],
      })
      .then((updated) => console.log(`New guild features ${updated}`))
      .catch(console.error);
  }
};

module.exports = musicInit;
