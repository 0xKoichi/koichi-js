const { filledBar } = require("string-progressbar");

module.exports = getProgress = (user) => {
  const exponent = 1.5;
  const baseXP = 1000;
  const xpNeeded = Math.floor(baseXP * Math.pow(user.s_LVL, exponent));
  const percentage = Math.round((user.xp / xpNeeded) * 100);
  const progress = filledBar(100, percentage, 20);
  return progress[0];
};
