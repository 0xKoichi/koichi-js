const { filledBar } = require("string-progressbar");

module.exports = getProgress = (user) => {
  xpNeeded = Math.round(user.s_LVL * 1000 * Math.exp(user.s_LVL / 50));
  const percentage = Math.round((user.xp / xpNeeded) * 100);
  const progress = filledBar(100, percentage, 20);
  return progress[0];
};
