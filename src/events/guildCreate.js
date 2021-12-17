const { fetchRoles } = require("../components/utils/admin-fetcher");
const { deployCommands } = require("../components/utils/command-builder");
const chalk = require("chalk");
const ora = require("ora");

async function guildHandler(client, guild) {
  if (!guild.available) return;

  client.commands = new Collection();
  client.guildMusic = new Collection();
  console.log(`${chalk.white(`Initialising ${guild}...`)}`);

  const roleFetch = ora({
    text: `${chalk.gray(`Fetching ${guild} roles...`)}`,
    color: "white",
    indent: 4,
    spinner: "arc",
  }).start();

  const deploying = ora({
    text: `${chalk.gray(`Deploying commands to ${guild}...`)}`,
    color: "white",
    indent: 4,
    spinner: "arc",
  });

  await fetchRoles(guild)
    .then((admins) => {
      roleFetch.succeed(`${chalk.green("Found guild roles.")}`);
      deploying.start();
      deployCommands(client, guild, admins)
        .then(() =>
          deploying.succeed(
            chalk.green(`Commands successfully deployed to ${guild}.`)
          )
        )
        .catch((err) => console.log(err));
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
  name: "guildCreate",
  execute(client, guild) {
    guildHandler(client, guild);
  },
};
