import { McLink } from ".";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  const world = process.argv[2];
  if (!world) {
    rl.write("Usage: mc-link [worldname]\n");
    process.exit(1);
  }
  rl.write("Installing datapack...");
  const link = new McLink(world);
  await link.ready;
  rl.write(" Ready.\n");
  rl.on("line", cmd => link.run(cmd));
}

main();
