const fs = require("fs");
const ytdl = require("ytdl-core");
const Queue = require("./queue");

const musicInit = async (interaction, client) => {
  console.log(interaction, client);
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
  const stages = guild.stageInstances;

  return await stages.create("1234567890123456789", {
    topic: "🎶",
    privacyLevel: "GUILD_ONLY",
  });
};

module.exports = musicInit;
