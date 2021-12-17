const fs = require("fs/promises");
const path = require("path");

module.exports = (async () => {
  const sourcePath = path.join(__dirname, "../../commands");
  let cmdDirs = await fs.readdir(sourcePath);

  cmdDirs = cmdDirs.filter(async (dirent) => {
    const dir = await fs.lstat(path.join(sourcePath, dirent));
    return dir.isDirectory();
  });

  const cmdFiles = [];

  for await (const dir of cmdDirs) {
    const dirCommands = await fs.readdir(path.join(sourcePath, dir), {
      withFileTypes: true,
    });

    console.log(dir);
    console.log(dirCommands);

    cmdFiles.push(
      ...dirCommands
        .filter((file) => file.name.endsWith(".js"))
        .map((file) => `/${dir}/${file.name}`)
    );
  }

  return cmdFiles;
})();
