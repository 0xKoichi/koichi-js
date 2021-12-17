const { redeploy } = require("../../../config/redeploy");

const eventListener = async (client, interaction) => {
  if (interaction.commandName === "Redeploy")
    return await redeploy(client, interaction);

  if (interaction.isCommand()) {
    await client.commands.execute(interaction);
    return;
  }

  if (interaction.isSelectMenu()) {
    const commandName = interaction.customId.slice(
      0,
      interaction.customId.indexOf("-")
    );
    const command = require(`../commands/${commandName}`);
    await command.changeCommand(interaction);
    return;
  }
};

module.exports = eventListener;
