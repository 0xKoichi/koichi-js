const { getFrom } = require("../db/interactions");
const economyEvent = require("../components/economy");

const messageHandler = async (message) => {
  if (message.author.bot) return;

  const { user, collection } = await getFrom(message);
  await economyEvent(message, user, collection);
};

module.exports = {
  name: "messageCreate",
  execute(client, message) {
    messageHandler(message);
  },
};
