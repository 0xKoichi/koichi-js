const dotenv = require("dotenv").config();
const { MongoClient } = require("mongodb");
const { MONGOURL } = process.env;

const connect = async (guildID) => {
  const client = new MongoClient(MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const dbName = guildID;
  try {
    await client.connect();
    const db = client.db(dbName);
    return db;
  } catch (err) {
    console.log(err);
  }
};

module.exports = connect;
