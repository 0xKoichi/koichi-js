const eventListener = async (interaction) => {
  if (interaction.isCommand()) {
    const command = require(`../commands/${interaction.commandName}`);
    await command.execute(interaction);
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
