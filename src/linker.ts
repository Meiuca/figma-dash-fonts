import chalk from "chalk";
import { spawn } from "child_process";
import MeiucaEngineCore from "meiuca-engine-core";

export default function (core: MeiucaEngineCore): Promise<void> {
  if (!core.config.fonts)
    return Promise.reject(new Error("fonts is undefined"));

  if (!core.config.fonts.linkCommand)
    return Promise.reject(new Error("fonts.linkCommand is undefined"));

  console.log(
    chalk.greenBright("\ninfo"),
    "Running",
    chalk.blueBright(core.config.fonts.linkCommand)
  );

  let [command, ...args] = core.config.fonts.linkCommand.split(" ");

  return new Promise((resolve, reject) => {
    let childProcess;

    try {
      childProcess = spawn(command!, args, {
        shell: process.env.OS && process.env.OS.includes("Windows"),
      });
    } catch (err) {
      reject(err);
      return;
    }

    childProcess.stdout.on("data", (chunk) => {
      console.log("\t", chunk.toString("utf-8").replace("\n", ""));
    });

    childProcess.stderr.on("data", (chunk) => {
      console.warn("\t", chunk.toString("utf-8").replace("\n", ""));
    });

    childProcess.on("error", reject);

    childProcess.on("close", (code) => {
      if (code === 0) {
        console.log(`\n${command} executed with exit code: 0`);

        resolve();
      } else {
        reject(new Error(`${command} executed with exit code: ${code}`));
      }
    });
  });
}
