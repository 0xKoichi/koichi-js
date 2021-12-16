const chalk = require("chalk");
const statusRotator = require("../components/status-rotator");

const execute = async (ctx) => {
  console.log(chalk.gray(`Logged in as ${ctx.user.tag}!`));
  statusRotator(ctx);
};

module.exports = {
  name: "ready",
  once: true,
  execute,
};
