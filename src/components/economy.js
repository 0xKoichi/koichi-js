const { MessageEmbed } = require("discord.js");
const { filledBar } = require("string-progressbar");
const { codeBlock } = require("@discordjs/builders");

const economyEvent = async (context, user, collection) => {
  const xpGained = Math.round(
    (15 * Math.log2(user.s_LVL + 50)) / Math.random()
  );
  const { currentLevel, currentXP, xpNeeded, totalXP } = await levelCheck(
    user,
    xpGained,
    context
  );

  const updatedUser = {
    $set: {
      username: user.username,
      xp: currentXP,
      xpNeeded: xpNeeded,
      totalXP: totalXP,
      messageCount: (user.messageCount += 1),
      s_LVL: currentLevel,
    },
  };
  const query = { userid: context.member.user.id };
  await collection.updateOne(query, updatedUser);
};

const levelCheck = async (user, newXP, context) => {
  let currentLevel = user.s_LVL;
  let xpNeeded = Math.round(currentLevel * 1000 * Math.exp(currentLevel / 50));
  let levelledUp = false;
  if (!user.totalXP) user.totalXP = newXP;
  else user.totalXP += newXP;
  let totalXP = user.totalXP;
  let currentXP = user.xp + newXP;

  for (currentLevel; user.xp > xpNeeded; currentLevel++) {
    xpNeeded = Math.round(currentLevel * 1000 * Math.exp(currentLevel / 50));
    currentXP = 0;
    levelledUp = true;
  }

  if (currentXP < 0) currentXP = 0;

  // Calculate progress
  xpNeeded = Math.round(currentLevel * 1000 * Math.exp(currentLevel / 50));
  const percentage = Math.round((currentXP / xpNeeded) * 100);
  const progress = filledBar(100, percentage, 20);

  if (levelledUp) {
    const embed = new MessageEmbed()
      .setTitle(``)
      .setDescription(
        `**<@${user.userid}> levelled up!**\n${codeBlock(
          `Level: ${currentLevel}\nTotal XP: ${user.totalXP}\nProgress: ${newXP} / ${xpNeeded} XP\n${progress[0]}`
        )}`
      )
      .setTimestamp()
      .setColor("RANDOM")
      .setThumbnail(`${context.member.user.avatarURL()}`);

    await context.reply({ content: " ", embeds: [embed] });
  }

  return { currentLevel, currentXP, xpNeeded, totalXP };
};

module.exports = economyEvent;
