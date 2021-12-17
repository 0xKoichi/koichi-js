const connect = require("../../db/connect");
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder, codeBlock } = require("@discordjs/builders");

const data = new SlashCommandBuilder()
  .setName("stats")
  .setDescription("Get some info about this server!")
  .setDefaultPermission(true);

const execute = async (interaction) => {
  const db = await connect(interaction.guildId);
  const collection = db.collection("Users");

  // Server stats
  const guild = await interaction.member.guild.fetch();
  const owner = await guild.fetchOwner(guild.ownerId);
  const userCount = guild.memberCount;
  const dateCreated = guild.createdAt;
  const online = guild.approximatePresenceCount;
  const usersInDb = await collection.estimatedDocumentCount();

  // Bot stats
  const application = interaction.client.application;
  const botCreatedAt = application.createdAt;
  const botServers = interaction.client.guilds.cache.size;
  const apiPing = interaction.client.ws.ping;
  const uptime = msToTime(interaction.client.uptime);
  const users = interaction.client.users.cache.size;

  const bInfo = codeBlock(
    `Here are a few little things about me:\nLatency: ${apiPing}ms 🏓\nCreator: Koichi 👑\nCreation Date: ${botCreatedAt.toLocaleDateString(
      "en-US"
    )}\nCurrent uptime: ${uptime}\nServers: ${botServers}\nCached Users: ${users}`
  );
  const sInfo = codeBlock(
    `The current owner of this server is ${
      owner.user.tag
    }. There are ${userCount} total users in this server and ${usersInDb} in the server database. Approximately there are ${online} users online. This guild was created at ${dateCreated.toLocaleDateString(
      "en-US"
    )}. You joined this server at ${interaction.member.joinedAt.toLocaleDateString(
      "en-US"
    )}`
  );

  const stats = new MessageEmbed()
    .setTitle(" ")
    .setDescription(
      `${codeBlock("ini", "[ Server Info ]")} ${sInfo} ${codeBlock(
        "css",
        "[ Bot Info ]"
      )} ${bInfo}`
    )
    .setTimestamp()
    .addFields(
      {
        name: "Source",
        value: "[GitHub](https://github.com/0xKoichi/disc-bot)",
        inline: true,
      },
      {
        name: "Add to Server",
        value:
          "[Invite](https://discord.com/api/oauth2/authorize?client_id=885279599246868521&permissions=545460846583&scope=bot%20applications.commands)",
        inline: true,
      },
      {
        name: "Docs",
        value: "[discord.js](https://discord.js.org/#/)",
        inline: true,
      }
    )
    .setFooter("Powered by Heroku.");

  await interaction.reply({ embeds: [stats] });
};

function msToTime(duration) {
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

module.exports = {
  data,
  execute,
};
