const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const dotenv = require("dotenv").config();
const { TOKEN, APP_ID } = dotenv.parsed;
const fetch = require("node-fetch");

const activitiesList = {
  youtube: {
    id: "880218394199220334",
    name: "Watch YouTube Together",
  },
  sketchy_artist: {
    id: "879864070101172255",
    name: "Sketchy Artist",
  },
};

const data = new SlashCommandBuilder()
  .setName("activity")
  .setDescription(
    "Set up activities with your friends! (Must be in Voice Channel)"
  )
  .addStringOption((option) =>
    option
      .setName("type")
      .setDescription("Choose the type of activity you want to create! (BETA)")
      .setRequired(true)
      .addChoice("Youtube", "youtube")
      .addChoice("Sketchy Artist", "sketchy_artist")
  );

const execute = async (interaction) => {
  console.log(interaction.options["_hoistedOptions"]);
  const guild = await interaction.member.guild.fetch();
  const member = await guild.members.fetch(interaction.user.id);
  const voiceChannel = member.voice.channel;
  console.log(voiceChannel);
  if (!voiceChannel || voiceChannel.type !== "GUILD_VOICE")
    return await interaction.reply({
      content: ":x: | You must be in a **voice** channel!",
      ephemeral: true,
    });
  if (!voiceChannel.permissionsFor(guild.me).has("CREATE_INSTANT_INVITE"))
    return await interaction.reply({
      content:
        ":x: | I need the **'CREATE_INSTANT_INVITE'** permission to do that.",
      ephemeral: true,
    });

  const activityValue = interaction.options["_hoistedOptions"][0].value;
  const activity = activitiesList[activityValue];

  fetch(`https://discord.com/api/v9/channels/${voiceChannel.id}/invites`, {
    method: "POST",
    body: JSON.stringify({
      max_age: 86400,
      max_uses: 0,
      target_application_id: activity["id"],
      target_type: 2,
      temporary: false,
      validate: null,
    }),
    headers: {
      Authorization: `Bot ${TOKEN}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(async (invite) => {
      if (invite.error || !invite.code)
        return interaction.reply({
          content: `:x: | Failed to create an invite for the new **${activity.name}** party!`,
          ephemeral: true,
        });
      await sendInvite(interaction, activity, voiceChannel, invite);
    })
    .catch((error) => console.log(error));
};

const sendInvite = async (interaction, activity, voiceChannel, invite) => {
  const inviteEmbed = new MessageEmbed()
    .setColor("#d34964")
    .setTitle(`New ${activity.name} party created!`)
    .setURL(`https://discord.gg/${invite.code}`)
    .setThumbnail(interaction.user.avatarURL())
    .setDescription(
      `${interaction.member.nickname} has started a new ${activity.name} party in ${voiceChannel.name}!
      You can join the party by either clicking on the hyperlink on the title of this embed, or by interacting with the buttons below.`
    )
    .setTimestamp();
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setURL(`https://discord.gg/${invite.code}`)
      .setLabel("Join!")
      .setStyle("LINK")
  );
  return await interaction.reply({
    content: "@here !",
    embeds: [inviteEmbed],
    components: [row],
  });
};

module.exports = {
  data,
  execute,
};
