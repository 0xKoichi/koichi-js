const connect = require("../db/connect");
const { User } = require("../db/schemas");
const { SlashCommandBuilder, codeBlock } = require("@discordjs/builders");
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
  const timestamp = dayjs().toISOString();
  const db = await connect(interaction.guildId);
  const username =
    interaction.member.nickname !== null
      ? interaction.member.nickname
      : interaction.user.username;

  try {
    const query = { userid: interaction.user.id };
    const collection = db.collection("Users");
    let user = await collection.findOne(query);

    if (user === null) {
      console.log("This is happening for some reason");
      user = new User(username, interaction.user.id, timestamp);
      await collection.insertOne(user);
      console.log(
        `${user.username} was inserted into ${interaction.guildId}'s database`
      );
    } else {
      const dailyReward = checkDailyReward(user, interaction) ? 1000 : 0;
      const updatedUser = {
        $set: {
          username: username,
          xp: (user.xp += dailyReward),
          lastReward: user.lastReward,
        },
      };
      const result = await collection.updateOne(query, updatedUser);
    }
  } catch (err) {}
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
