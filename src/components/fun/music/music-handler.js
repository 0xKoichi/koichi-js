const fs = require("fs");
const ytdl = require("ytdl-core");
const Queue = require("./queue");

const musicInit = async (client, interaction) => {
  await queueHandler(client, interaction);
};

const queueHandler = async (client, interaction) => {
  await stageHandler(interaction);
  // if (!client.guildMusic.has(interaction.guildId)) {
  //   client.guildMusic.set()
  // }
};

const stageHandler = async (interaction) => {
  const guild = await interaction.member.guild.fetch();
  const member = await guild.members.fetch(interaction.user.id);
  const stages = guild.stageInstances;

  return await stages.create("1234567890123456789", {
    topic: "🎶",
    privacyLevel: "GUILD_ONLY",
  });
};

module.exports = musicInit;
