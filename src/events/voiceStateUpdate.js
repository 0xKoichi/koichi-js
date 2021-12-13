const checkState = async (client, oldState, newState) => {
  let newChannelState = newState.channel;
  let oldChannelState = oldState.channel;

  if (oldChannelState !== null) {
    oldState.guild.members
      .fetch(oldState.id)
      .then(async (user) => {
        const username =
          user.nickname !== null ? user.nickname : user.user.username;
        if (oldChannelState.name === `${username}'s party`) {
          oldState.guild.channels
            .fetch(oldState.channelId)
            .then((channel) => {
              deleteChannel(channel);
            })
            .catch(console.log);
        }
      })
      .catch(console.log);
  }
};

const deleteChannel = async (channel) => {
  try {
    return await channel.delete("Party host left the channel.");
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  name: "voiceStateUpdate",
  execute(client, oldState, newState) {
    checkState(client, oldState, newState);
  },
};
