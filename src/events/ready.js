const chalk = require("chalk");

const execute = async (ctx) => {
  console.log(chalk.gray(`Logged in as ${ctx.user.tag}!`));
  ctx.user.setAvatar(
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b8919e7a-2bb5-40c7-af15-8218d853bd92/d4njygs-38bef077-dd7a-4e80-8ac2-663485780f8c.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2I4OTE5ZTdhLTJiYjUtNDBjNy1hZjE1LTgyMThkODUzYmQ5MlwvZDRuanlncy0zOGJlZjA3Ny1kZDdhLTRlODAtOGFjMi02NjM0ODU3ODBmOGMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.QqebgwhESsFn9NTetrmu7qI4l9juTGmfL59O0TjH4Zo"
  );
  ctx.user.setActivity("being the most based bot", { type: "COMPETING" });
};

module.exports = {
  name: "ready",
  once: true,
  execute,
};
