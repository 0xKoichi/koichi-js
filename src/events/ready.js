const { deployCommands } = require("../components/command-builder");
const chalk = require("chalk");
const ora = require("ora");

const execute = async (ctx) => {
  console.log(chalk.gray(`Logged in as ${ctx.user.tag}!`));
  const loadingCommands = ora({
    text: `${chalk.red("Deploying commands...")}`,
    color: "white",
    indent: 4,
    spinner: "arc",
  }).start();
  await deployCommands(ctx)
    .then((res) => {
      loadingCommands.succeed(
        `${chalk.green(
          `Command deployment ${res.toLowerCase()}, bot is ready!`
        )}`
      );
    })
    .catch((err) => {
      loadingCommands.text(
        `${chalk.red(`${err}! Command deployment failed.`)}`
      );
    });
};

module.exports = {
  name: "ready",
  once: true,
  execute,
};
