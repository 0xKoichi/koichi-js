const { OVERRIDE } = process.env;
const { deployCommands } = require("../src/components/command-builder");
const { fetchRoles } = require("../src/components/admin-fetcher");
const { MessageEmbed } = require("discord.js");

const redeploy = async (client, interaction) => {
  if (interaction.user.id === OVERRIDE) {
    return await masterGuilds(client, interaction);
  } else if (interaction.user.id === interaction.guild.ownerId) {
    await localGuild(client, interaction);
  } else
    await interaction.reply({
      content: "You aren't the owner of this server!",
      ephemeral: true,
    });
};

const localGuild = async (client, interaction) => {
  const thisGuild = await client.guilds.fetch(interaction.guildId);
  const admins = await fetchRoles(thisGuild);
  await deploySelf(client, thisGuild, admins);
  await deployCommands(client, thisGuild, admins);

  interaction.reply({
    content: ":white_check_mark: || Commands successfully redeployed.",
    ephemeral: true,
  });
};

const deploySelf = async (client, guild, admins) => {
  return await client.api
    .applications(client.user.id)
    .guilds(guild.id)
    .commands.post({
      data: {
        name: "Redeploy",
        type: 2,
      },
    })
    .then((res) => {
      client.api
        .applications(client.user.id)
        .guilds(guild.id)
        .commands.permissions.set({
          data: {
            id: res.id,
            type: 1,
            permissions: [...admins],
          },
        });
    })
    .catch(console.error);
};

const masterGuilds = async (client, interaction) => {
  console.log(interaction);
  const tracker = new MessageEmbed()
    .setTitle("Updating all servers...")
    .setDescription("Working...")
    .setAuthor(
      "koichi.js",
      `${client.user.avatarURL()}`,
      "https://github.com/0xKoichi/disc-bot"
    )
    .setThumbnail(
      "https://vignette.wikia.nocookie.net/spartaremix/images/e/ec/Discord-new-logo.png/revision/latest?cb=20180224071554"
    )
    .setTimestamp();

  const fields = [];
  const guilds = await client.guilds.fetch();

  guilds.forEach((guild) => {
    fields.push({ name: guild.name, value: "In progress..." });
    tracker.setFields(fields);
  });

  const msg = await interaction.reply({
    content: " ",
    embeds: [tracker],
    fetchReply: true,
  });
  for await (const guild of guilds) {
    const [, thisGuild] = guild;
    const fetchedGuild = await thisGuild.fetch();
    const admins = await fetchRoles(fetchedGuild);
    await deploySelf(client, fetchedGuild, admins);
    await deployCommands(client, fetchedGuild, admins);
    const newFields = fields.map((v) => {
      console.log(v.name);
      if (v.name == fetchedGuild.name) {
        v.value = "Redeployment completed :white_check_mark:";
      }
      return v;
    });
    await tracker.setFields(newFields);
    await msg.edit({ content: " ", embeds: [tracker] });
  }

  tracker.setDescription("Done.");
  await msg.edit({ content: " ", embeds: [tracker] });
};

module.exports = {
  redeploy,
};
