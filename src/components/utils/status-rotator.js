const { statuses } = require("../../../config/config.json");

const presence = ["online", "idle", "dnd"];
const types = ["WATCHING", "LISTENING", "COMPETING"];
let currentStatusIndex, currentPresenceIndex;

const statusRotator = async (client) => {
  (currentPresenceIndex = 0), (currentStatusIndex = 0);
  await setRandomStatus(client).then((res) => {
    return statusRotator(client);
  });
};

const setRandomStatus = async (client) => {
  await client.user.setPresence(randomizeStatus());
  return new Promise((res) => {
    setTimeout(res, 10000);
  });
};

const randomizeStatus = () => {
  currentStatusIndex = Math.floor(Math.random() * (statuses.length - 1));
  currentPresenceIndex = Math.floor(Math.random() * (presence.length - 1));
  currentTypeIndex = Math.floor(Math.random() * (types.length - 1));

  const newPresence = {
    activities: [
      { name: statuses[currentStatusIndex], type: types[currentTypeIndex] },
    ],
    status: presence[currentPresenceIndex],
  };

  return newPresence;
};

module.exports = statusRotator;
