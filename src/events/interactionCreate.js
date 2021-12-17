const eventListener = require("../components/utils/event-listener");

module.exports = {
  name: "interactionCreate",
  execute(client, interaction) {
    eventListener(client, interaction);
  },
};
