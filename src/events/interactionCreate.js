const eventListener = require("../components/event-listener");

module.exports = {
  name: "interactionCreate",
  execute(client, interaction) {
    eventListener(interaction);
  },
};
