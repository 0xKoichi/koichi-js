const { getFrom } = require("../../db/interactions");
const { User } = require("../../db/schemas");
const { SlashCommandBuilder } = require("@discordjs/builders");
const relativeTime = require("dayjs/plugin/relativeTime");
const dayjs = require("dayjs");
const { MessageEmbed } = require("discord.js");
dayjs.extend(relativeTime, {
  thresholds: [
    { l: "s", r: 1 },
    { l: "m", r: 1 },
    { l: "mm", r: 59, d: "minute" },
    { l: "h", r: 1 },
    { l: "hh", r: 23, d: "hour" },
    { l: "d", r: 1 },
    { l: "dd", r: 29, d: "day" },
    { l: "M", r: 1 },
    { l: "MM", r: 11, d: "month" },
    { l: "y" },
    { l: "yy", d: "year" },
  ],
  rounding: Math.floor,
});

const data = new SlashCommandBuilder()
  .setName("daily")
  .setDescription("Get your daily reward!")
  .setDefaultPermission(true);

const execute = async (interaction) => {
  const { user, collection } = await getFrom(interaction);
  const username =
    interaction.member.nickname !== null
      ? interaction.member.nickname
      : interaction.user.username;
  const query = { userid: interaction.user.id };
  const dailyReward = (await checkDailyReward(user, interaction)) ? 1000 : 0;
  const updatedUser = {
    $set: {
      username: username,
      xp: (user.xp += dailyReward),
      lastReward: user.lastReward,
    },
  };
  await collection.updateOne(query, updatedUser);
};

const checkDailyReward = async (user, interaction) => {
  const userDate = dayjs(user.lastReward);
  const lastReceived = userDate.fromNow();
  const next = userDate.add(1, "day");
  let difference = Math.abs(dayjs().diff(next, "hour"));
  if (difference > 1) difference = `${difference} hours`;
  else difference = `${difference} hour`;

  if (/day/gi.test(lastReceived)) {
    const embed = new MessageEmbed()
      .setTitle(`${user.username} has claimed their reward! :white_check_mark:`)
      .setDescription(
        "That earned you 1000xp, you can claim your next reward in 24 hours!"
      )
      .setTimestamp()
      .setThumbnail(`${interaction.user.avatarURL()}`);

    user.lastReward = dayjs().toISOString();
    await interaction.reply({ content: " ", embeds: [embed] });
    return true;
  } else {
    const embed = new MessageEmbed()
      .setTitle(`Daily reward unavailable :x:`)
      .setDescription(
        `Sorry, ${user.username}, your next daily reward isn't available for ${difference}... Come back later!`
      )
      .setTimestamp()
      .setThumbnail(`${interaction.user.avatarURL()}`);
    await interaction.reply({ content: " ", embeds: [embed] });
    return false;
  }
};
module.exports = {
  data,
  execute,
};
