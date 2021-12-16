const connect = require("./connect");
const dayjs = require("dayjs");
const { User } = require("./schemas");

const getFrom = async (context) => {
  const db = await connect(context.guildId);
  const username =
    context.member.nickname !== null
      ? context.member.nickname
      : context.member.user.username;

  const query = { userid: context.member.user.id };
  const collection = db.collection("Users");

  let user = await collection.findOne(query);

  if (user === null) {
    const timestamp = dayjs().toISOString();
    user = new User(username, context.member.user.id, timestamp);
    await collection.insertOne(user);
    console.log(
      `${user.username} was inserted into ${context.guildId}'s database`
    );
  }

  return { db, collection, user };
};

module.exports = {
  getFrom,
};
