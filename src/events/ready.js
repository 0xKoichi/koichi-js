const chalk = require("chalk");

const execute = async (ctx) => {
  console.log(chalk.gray(`Logged in as ${ctx.user.tag}!`));
  await ctx.user.setActivity("being the most based bot", { type: "COMPETING" });
};

module.exports = {
  name: "ready",
  once: true,
  execute,
};
