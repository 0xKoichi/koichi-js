const eventListener = async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Alina I wanna fuck your pussy");
  }
};

module.exports = eventListener;
