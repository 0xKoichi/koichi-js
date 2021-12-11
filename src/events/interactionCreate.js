const eventListener = require("../components/event-listener");

module.exports = {
  name: "interactionCreate",
  execute(interaction) {
    eventListener(interaction);
  },
};
