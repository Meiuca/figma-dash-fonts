const chalk = require("chalk");
const { spawn } = require("child_process");
const { tab } = require("figma-dash-core/functions");
const config = require("figma-dash-core/config-handler").handle();

module.exports = () => {
  console.log(
    chalk.greenBright("\ninfo"),
    "Running",
    chalk.blueBright(config.fonts.linkCommand)
  );

  let [command, ...args] = config.fonts.linkCommand.split(" ");

  return new Promise((resolve, reject) => {
    let childProcess;

    try {
      childProcess = spawn(command, args, {
        shell: process.env.OS && process.env.OS.includes("Windows"),
      });
    } catch (err) {
      reject(err);
    }

    childProcess.stdout.on("data", (chunk) => {
      console.log(tab(1), chunk.toString("utf-8").replace("\n", ""));
    });

    childProcess.stderr.on("data", (chunk) => {
      console.warn(tab(1), chunk.toString("utf-8").replace("\n", ""));
    });

    childProcess.on("error", reject);

    childProcess.on("close", (code) => {
      if (code == 0) {
        console.log(`\n${command} executed with exit code: 0`);

        resolve();
      } else {
        reject(new Error(`${command} executed with exit code: ${code}`));
      }
    });
  });
};
