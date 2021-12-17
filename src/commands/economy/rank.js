const { SlashCommandBuilder, codeBlock } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { getFrom } = require("../../db/interactions");
const getProgress = require("../../components/economy/user-progress");
const { redeploy } = require("../../../config/redeploy");

const data = new SlashCommandBuilder()
  .setName("rank")
  .setDescription("Get your rank in this server's league!")
  .setDefaultPermission(true);

const execute = async (interaction) => {
  redeploy(interaction.client, interaction);
  const guild = await interaction.client.guilds.cache.get(interaction.guildId);
  const guildIcon = await guild.iconURL();
  const icon = guildIcon !== null ? guildIcon : "";
  const username =
    interaction.member.nickname !== null
      ? interaction.member.nickname
      : interaction.user.username;

  const { user, collection } = await getFrom(interaction);
  const leaderboard = collection.find({}).sort({ s_LVL: -1, totalXP: -1 });
  const progress = getProgress(user);
  let rank,
    currentLVL,
    description = "\n",
    count = 1;

  const cachedLeaderboard = new Map();

  await leaderboard.forEach((user) => {
    cachedLeaderboard.set(count, user);
    if (user.username === username) {
      rank = count;
      currentLVL = `[Level: ${user.s_LVL}]`;
      currentXP = `[Total XP: ${user.totalXP}]`;
    }
    count++;
  });

  for (const [key, value] of cachedLeaderboard) {
    if (key > rank && key - rank <= 3) {
      description += `${key}: ${value.username}\n`;
    }

    if (value.username === username)
      description += `${key}: ${username} ${currentLVL} <<<\n`;

    if (key < rank && rank - key <= 3) {
      description += `${key}: ${value.username}\n`;
    }
  }

  const embed = new MessageEmbed()
    .setTitle("")
    .setDescription(
      `**${username}'s stats:**
      ${codeBlock(
        `Rank: ${rank}/${cachedLeaderboard.size}\nCurrent XP: ${
          user.xp
        }\nXP Needed: ${user.xpNeeded - user.xp}\n${progress}`
      )}
    
    **Your place in the leaderboard:**
    ${codeBlock(`${description}`)}`
    )
    .setTimestamp()
    .setColor("RANDOM")
    .setThumbnail(icon)
    .setFooter(username, interaction.user.avatarURL());

  await interaction.reply({ embeds: [embed] });
};

module.exports = {
  data,
  execute,
};
