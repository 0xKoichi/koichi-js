const { redeploy } = require("../../../config/redeploy");

const eventListener = async (client, interaction) => {
  if (interaction.commandName === "Redeploy")
    return await redeploy(client, interaction);

  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    await command.execute(interaction, client);
    return;
  }

  if (interaction.isSelectMenu()) {
    const commandName = interaction.customId.slice(
      0,
      interaction.customId.indexOf("-")
    );
    const command = client.commands.get(interaction.commandName);
    await command.changeCommand(interaction);
    return;
  }
};

module.exports = eventListener;
