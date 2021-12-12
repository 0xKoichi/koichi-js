const chalk = require("chalk");

const execute = async (ctx) => {
  console.log(chalk.gray(`Logged in as ${ctx.user.tag}!`));
};

module.exports = {
  name: "ready",
  once: true,
  execute,
};
