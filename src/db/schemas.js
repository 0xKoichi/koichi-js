class User {
  constructor(username, userid, timestamp) {
    this.username = username;
    this.userid = userid;
    this.xp = 0;
    this.totalXP = 0;
    this.messageCount = 1;
    this.s_LVL = 1;
    this.lastReward = timestamp;
    this.xpNeeded = 0;
  }
}

module.exports = {
  User,
};
