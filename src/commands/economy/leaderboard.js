const { getFrom } = require("../../db/interactions");
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder, codeBlock } = require("@discordjs/builders");

const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Get the leaderboard in this server!")
  .setDefaultPermission(true);

const execute = async (interaction) => {
  const guild = await interaction.client.guilds.cache.get(interaction.guildId);
  const guildIcon = await guild.iconURL();
  const icon = guildIcon !== null ? guildIcon : "";

  const username =
    interaction.member.nickname !== null
      ? interaction.member.nickname
      : interaction.user.username;

  const { collection } = await getFrom(interaction);
  let leaderboard = collection
    .find({})
    .sort({ s_LVL: -1, totalXP: -1 })
    .limit(5);

  let description = "";
  let count = 1;
  await leaderboard.forEach((user) => {
    switch (count) {
      case 1:
        positions = "  🥇  ";
        break;
      case 2:
        positions = "  🥈  ";
        break;
      case 3:
        positions = "  🥉  ";
        break;
      default:
        positions += ``;
        break;
    }

    let currentLVL = `[Level: ${user.s_LVL}]`;
    let currentXP = `[Total XP: ${user.totalXP}]`;

    description += `${count}: ${user.username} ${currentLVL} ${currentXP} ${positions}\n`;
    count++;
  });

  const embed = new MessageEmbed()
    .setTitle("")
    .setDescription(
      `**${interaction.guild.name}'s Leaderboard:**\n\n${codeBlock(
        `TOP FIVE:\n${description}`
      )}
      
      *Use /rank to see your individual stats*`
    )
    .setTimestamp()
    .setColor("#1db35b")
    .setThumbnail(`${icon}`)
    .setFooter(`${username}`, `${interaction.user.avatarURL()}`);

  return await interaction.reply({ embeds: [embed] });
};

module.exports = {
  data,
  execute,
};
