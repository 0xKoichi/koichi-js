const { MongoClient } = require("mongodb");
const { MONGOURL } = process.env;

const client = new MongoClient(MONGOURL);
let db;

const connect = async (guildID) => {
  const dbName = guildID;
  try {
    await client.connect();
    db = client.db(dbName);
    return db;
  } catch (err) {
    console.log(err);
  }
};

module.exports = connect;