const { redeploy } = require("../../../config/redeploy");

const eventListener = async (client, interaction) => {
  console.log(client.commands);
  if (interaction.commandName === "Redeploy")
    return await redeploy(client, interaction);

  if (interaction.isCommand()) {
    console.log(interaction.commandName, client.commands);
    const command = client.commands.get(interaction.commandName);
    await command.execute(interaction);
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
